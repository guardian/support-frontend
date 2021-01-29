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

  def writeToDynamo(stage: Stage, state: UpdateDynamoState, timeOutCheck: TimeOutCheck) = {
    val csvStream = S3Service.streamFromS3(stage, state.filename)
    val csvReader = csvStream.asCsvReader[SupporterRatePlanItem](rfc.withHeader)
    val dynamoDBService = DynamoDBService(stage)

    val unProcessed = csvReader.drop(state.processedCount).zipWithIndex.toList

    val validUnprocessedRows = unProcessed.filter { case (itemOrError, _) => itemOrError.isRight }
    val invalidRows = unProcessed.filter { case (itemOrError, _) => itemOrError.isLeft }

    if (invalidRows.nonEmpty)
      SafeLogger.error(
        scrub"There were ${invalidRows.length} CSV read failures from file ${state.filename} with line numbers ${invalidRows.map(_._2).mkString(",")}"
      )

    val batches = validUnprocessedRows
      .map { case (itemOrError, index) => (itemOrError.right.get, index) }
      .grouped(batchSize)

    val itemsProcessedInThisExecutionCount = writeBatchesUntilTimeout(batches, timeOutCheck, dynamoDBService)

    Future.successful(
      state.copy(
        processedCount = itemsProcessedInThisExecutionCount + state.processedCount
      ))
  }

  def writeBatchesUntilTimeout(
    groups: Iterator[List[(SupporterRatePlanItem, Int)]],
    timeOutCheck: TimeOutCheck,
    dynamoDBService: DynamoDBService
  ): Int =
    groups.foldLeft(0) {
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

        Await.result(writeBatch(group, dynamoDBService), 30.seconds)
        SafeLogger.info(
          s"${processedCount + group.length} items processed"
        )
        val (_, processedIndex ) = group.last
        processedIndex + 1
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
            // lets log and keep going if one insert fails
            case error: Throwable => SafeLogger.error(scrub"An error occurred trying to write item $supporterRatePlanItem, at index $index", error)
          }

    }
    Future.sequence(futures)
  }
}
