package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.lambdas.UpdateDynamoLambda.{batchSize, writeToDynamo}
import com.gu.model.Stage
import com.gu.model.dynamo.SupporterRatePlanItem
import com.gu.model.states.UpdateDynamoState
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.services.{DynamoDBService, S3Service}
import kantan.csv._
import kantan.csv.ops._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.DurationInt
import scala.concurrent.{Await, Future}

trait TimeOutCheck {
  def timeRemainingMillis: Int
}

class ContextTimeOutCheck(context: Context) extends TimeOutCheck {
  override def timeRemainingMillis = context.getRemainingTimeInMillis
}

class UpdateDynamoLambda extends Handler[UpdateDynamoState, UpdateDynamoState] {
  override protected def handlerFuture(input: UpdateDynamoState, context: Context) = {
    SafeLogger.info(s"Starting write to dynamo task for ${input.recordCount} records from ${input.filename}")
    writeToDynamo(Stage.fromEnvironment, input, new ContextTimeOutCheck(context))
  }
}

object UpdateDynamoLambda {
  val batchSize = 10
  val timeoutBufferInMillis = batchSize * 5 * 1000

  def writeToDynamo(stage: Stage, state: UpdateDynamoState, timeOutCheck: TimeOutCheck): Future[UpdateDynamoState] = {
    val csvStream = S3Service.streamFromS3(stage, state.filename)
    val csvReader = csvStream.asCsvReader[SupporterRatePlanItem](rfc.withHeader)
    val dynamoDBService = DynamoDBService(stage)

    val unProcessed = getUnprocessedItems(csvReader, state.processedCount)

    val validUnprocessed = unProcessed.collect { case (Right(item), index) => (item, index) }
    val invalidUnprocessedIndexes = unProcessed.collect { case (Left(_), index) => index }

    if (invalidUnprocessedIndexes.nonEmpty && state.processedCount == 0)
      SafeLogger.error(
        scrub"There were ${invalidUnprocessedIndexes.length} CSV read failures from file ${state.filename} with line numbers ${invalidUnprocessedIndexes.mkString(",")}"
      )

    val batches = validUnprocessed.grouped(batchSize)

    val processedCount = writeBatchesUntilTimeout(
      state.processedCount,
      batches,
      timeOutCheck,
      dynamoDBService
    )

    Future.successful(state.copy(
        processedCount = processedCount
      ))
  }

  def getUnprocessedItems(csvReader:  CsvReader[ReadResult[SupporterRatePlanItem]], processedCount: Int) =
    csvReader.zipWithIndex.drop(processedCount).toList

  def writeBatchesUntilTimeout(
    processedCount: Int,
    groups: Iterator[List[(SupporterRatePlanItem, Int)]],
    timeOutCheck: TimeOutCheck,
    dynamoDBService: DynamoDBService
  ): Int =
    groups.foldLeft(processedCount) {
      (processedCount, group) =>
        if (timeOutCheck.timeRemainingMillis < timeoutBufferInMillis) {
          SafeLogger.info(
            s"Aborting processing - time remaining: ${timeOutCheck.timeRemainingMillis / 1000} seconds, buffer: ${timeoutBufferInMillis / 1000} seconds"
          )
          return processedCount
        }
        SafeLogger.info(
          s"Continuing processing - time remaining: ${timeOutCheck.timeRemainingMillis / 1000} seconds, buffer: ${timeoutBufferInMillis / 1000} seconds"
        )

        Await.result(writeBatch(group, dynamoDBService), 120.seconds)

        val (_, highestProcessedIndex ) = group.last
        val newProcessedCount = highestProcessedIndex + 1
        SafeLogger.info(s"$newProcessedCount items processed")
        newProcessedCount
    }

  def writeBatch(list: List[(SupporterRatePlanItem, Int)], dynamoDBService: DynamoDBService) = {
    val futures = list.map {
      case (supporterRatePlanItem, index) =>
        SafeLogger.info(
          s"Attempting to write item index $index - ${supporterRatePlanItem.productRatePlanName} " +
            s"rate plan with term end date ${supporterRatePlanItem.termEndDate} to Dynamo")
        dynamoDBService
          .writeItem(supporterRatePlanItem)
          .recover {
            // let's log and keep going if one insert fails
            case error: Throwable => SafeLogger.error(scrub"An error occurred trying to write item $supporterRatePlanItem, at index $index", error)
          }

    }
    Future.sequence(futures)
  }
}
