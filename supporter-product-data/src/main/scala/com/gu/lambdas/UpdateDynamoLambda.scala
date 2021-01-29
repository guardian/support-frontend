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
  def shouldFinishProcessing: Boolean
}

class ContextTimeOutCheck(context: Context) extends TimeOutCheck {
  val timeoutBufferInMillis = batchSize * 5 * 1000

  override def shouldFinishProcessing =
    context.getRemainingTimeInMillis <= timeoutBufferInMillis
}

class UpdateDynamoLambda extends Handler[UpdateDynamoState, UpdateDynamoState] {
  override protected def handlerFuture(input: UpdateDynamoState, context: Context) = {
    SafeLogger.info(s"Starting write to dynamo task for ${input.recordCount} records from ${input.filename}")
    writeToDynamo(Stage.fromEnvironment, input, new ContextTimeOutCheck(context))
  }
}

object UpdateDynamoLambda {
  val batchSize = 10

  def writeToDynamo(stage: Stage, state: UpdateDynamoState, timeOutCheck: TimeOutCheck) = {
    val csvStream = S3Service.streamFromS3(stage, state.filename)
    val csvReader = csvStream.asCsvReader[SupporterRatePlanItem](rfc.withHeader)
    val dynamoDBService = DynamoDBService(stage)

    val all = csvReader.zipWithIndex.toList
    val successful = all.filter { case (itemOrError, _) => itemOrError.isRight }
    val failed = all.filter { case (itemOrError, _) => itemOrError.isLeft }
    if (failed.nonEmpty)
      SafeLogger.error(
        scrub"There were ${failed.length} CSV read failures from file ${state.filename} with line numbers ${failed.map(_._2).mkString(",")}"
      )

    val batches = successful
      .map { case (itemOrError, index) => (itemOrError.right.get, index) }
      .grouped(batchSize)

    val processed = writeBatchesUntilTimeout(batches, timeOutCheck, dynamoDBService)

    Future.successful(state.copy(processedCount = processed))
  }

  def writeBatchesUntilTimeout(
    groups: Iterator[List[(SupporterRatePlanItem, Int)]],
    timeOutCheck: TimeOutCheck,
    dynamoDBService: DynamoDBService
  ): Int =
    groups.foldLeft(0) {
      (processedCount, group) =>
        if (timeOutCheck.shouldFinishProcessing) {
          return processedCount
        }
        Await.result(writeBatch(group, dynamoDBService), 30.seconds)
        processedCount + group.length
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
