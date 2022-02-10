package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.lambdas.UpdateDynamoLambda.writeToDynamo
import com.gu.model.StageConstructors
import com.gu.model.dynamo.SupporterRatePlanItemCodecs._
import com.gu.model.states.UpdateDynamoState
import com.gu.services.{AlarmService, ConfigService, S3Service}
import com.gu.supporterdata.model.{Stage, SupporterRatePlanItem}
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.typesafe.scalalogging.StrictLogging
import io.circe.syntax.EncoderOps
import kantan.csv._
import kantan.csv.ops._

import scala.collection.mutable.ListBuffer
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
    writeToDynamo(StageConstructors.fromEnvironment, input, new ContextTimeOutCheck(context))
  }
}

object UpdateDynamoLambda extends StrictLogging {
  val maxBatchSize = 5
  val timeoutBufferInMillis = maxBatchSize * 5 * 1000

  def writeToDynamo(stage: Stage, state: UpdateDynamoState, timeOutCheck: TimeOutCheck): Future[UpdateDynamoState] = {
    logger.info(s"Starting write to dynamo task for ${state.recordCount} records from ${state.filename}")

    val s3Object = S3Service.streamFromS3(stage, state.filename)
    val csvReader = s3Object.getObjectContent.asCsvReader[SupporterRatePlanItem](rfc.withHeader)
    val dynamoDBService = SupporterDataDynamoService(stage)
    val alarmService = AlarmService(stage)

    val unProcessed = getUnprocessedItems(csvReader, state.processedCount)

    // Close this after retrieving all the items
    s3Object.close()

    val validUnprocessed = unProcessed.collect { case (Right(item), index) => (item, index) }
    val invalidUnprocessedIndexes = unProcessed.collect { case (Left(_), index) => index }

    if (invalidUnprocessedIndexes.nonEmpty && state.processedCount == 0) {
      logger.error(
        s"There were ${invalidUnprocessedIndexes.length} CSV read failures from file ${state.filename} with line numbers ${invalidUnprocessedIndexes
            .mkString(",")}",
      )
      alarmService.triggerCsvReadAlarm
    }

    val batches = batchItemsWhichCanUpdateConcurrently(validUnprocessed)

    val processedCount = writeBatchesUntilTimeout(
      state.processedCount,
      batches,
      timeOutCheck,
      dynamoDBService,
      alarmService,
    )

    val maybeSaveSuccessTime =
      if (processedCount == state.recordCount)
        ConfigService(stage).putLastSuccessfulQueryTime(state.attemptedQueryTime)
      else Future.successful(())

    maybeSaveSuccessTime.map(_ => state.copy(processedCount = processedCount))
  }

  def getUnprocessedItems(csvReader: CsvReader[ReadResult[SupporterRatePlanItem]], processedCount: Int) =
    csvReader.zipWithIndex.drop(processedCount).toList

  def writeBatchesUntilTimeout(
      processedCount: Int,
      batches: List[List[(SupporterRatePlanItem, Int)]],
      timeOutCheck: TimeOutCheck,
      dynamoDBService: SupporterDataDynamoService,
      alarmService: AlarmService,
  ): Int =
    batches.foldLeft(processedCount) { (processedCount, batch) =>
      if (timeOutCheck.timeRemainingMillis < timeoutBufferInMillis) {
        logger.info(
          s"Aborting processing - time remaining: ${timeOutCheck.timeRemainingMillis / 1000} seconds, buffer: ${timeoutBufferInMillis / 1000} seconds",
        )
        return processedCount
      }
      logger.info(
        s"Continuing processing with batch of ${batch.length} - time remaining: ${timeOutCheck.timeRemainingMillis / 1000} seconds, buffer: ${timeoutBufferInMillis / 1000} seconds",
      )

      Await.result(writeBatch(batch, dynamoDBService, alarmService), 120.seconds)

      val (_, highestProcessedIndex) = batch.last
      val newProcessedCount = highestProcessedIndex + 1
      logger.info(s"$newProcessedCount items processed")
      newProcessedCount
    }

  def writeBatch(
      list: List[(SupporterRatePlanItem, Int)],
      dynamoDBService: SupporterDataDynamoService,
      alarmService: AlarmService,
  ) = {
    val futures = list.map { case (supporterRatePlanItem, index) =>
      logger.info(
        s"Attempting to write item index $index - ${supporterRatePlanItem.productRatePlanName} to Dynamo - ${supporterRatePlanItem.asJson.noSpaces}",
      )
      dynamoDBService.writeItem(supporterRatePlanItem)
    }
    Future.sequence(futures)
  }

  def batchItemsWhichCanUpdateConcurrently(
      items: List[(SupporterRatePlanItem, Int)],
  ): List[List[(SupporterRatePlanItem, Int)]] = {
    // 'Batch' supporterRatePlanItems up into groups which we can update in Dynamo concurrently.
    // For this to be safe we need to make sure that no group has more than one item with the same subscription name in it because if it does
    // then order of execution is important and we can't guarantee this with parallel executions.

    def batchAlreadyHasAnItemForThisSubscription(
        batch: ListBuffer[(SupporterRatePlanItem, Int)],
        subscriptionName: String,
    ) =
      batch.exists { case (item, _) =>
        item.subscriptionName == subscriptionName
      }

    // Using mutable state for performance reasons, it is many times faster than the immutable version
    val result = ListBuffer(ListBuffer.empty[(SupporterRatePlanItem, Int)])

    for ((item, index) <- items) {
      val currentBatch = result.last
      if (
        batchAlreadyHasAnItemForThisSubscription(
          currentBatch,
          item.subscriptionName,
        ) || currentBatch.length == maxBatchSize
      )
        result += ListBuffer((item, index))
      else
        currentBatch += ((item, index))
    }
    result.map(_.toList).toList
  }

}
