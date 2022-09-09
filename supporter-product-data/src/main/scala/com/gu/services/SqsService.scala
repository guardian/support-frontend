package com.gu.services

import com.amazonaws.regions.Regions
import com.amazonaws.services.sqs.AmazonSQSAsyncClientBuilder
import com.amazonaws.services.sqs.model.{
  SendMessageBatchRequest,
  SendMessageBatchRequestEntry,
  SendMessageRequest,
  SendMessageResult,
}
import com.gu.aws.{AwsAsync, CredentialsProvider}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.supporterdata.model.{ContributionAmount, Stage, SupporterRatePlanItem}
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax.EncoderOps

import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters._
import scala.util.{Failure, Success, Try}

class SqsService(queueName: String, alarmService: AlarmService)(implicit val executionContext: ExecutionContext) {
  implicit val encoder: Encoder[SupporterRatePlanItem] = deriveEncoder
  implicit val contributionAmountEncoder: Encoder[ContributionAmount] = deriveEncoder
  private val sqsClient = AmazonSQSAsyncClientBuilder.standard
    .withCredentials(CredentialsProvider)
    .withRegion(Regions.EU_WEST_1)
    .build()

  private val queueUrl = sqsClient.getQueueUrl(queueName).getQueueUrl

  def sendBatch(supporterRatePlanItems: List[(SupporterRatePlanItem, Int)]) = {
    SafeLogger.info(s"Sending message batch with ${supporterRatePlanItems.length} items to SQS queue $queueUrl")

    val batchRequestEntries = supporterRatePlanItems.map { case (item, index) =>
      new SendMessageBatchRequestEntry(index.toString, item.asJson.noSpaces)
    }

    val batchRequest = new SendMessageBatchRequest(queueUrl, batchRequestEntries.asJava)
    sqsClient.sendMessageBatch(batchRequest)

    Try(sqsClient.sendMessageBatch(batchRequest)) match {
      case Success(batchResult) =>
        val failures = batchResult.getFailed.asScala.toList
        if (failures.nonEmpty) {
          failures.foreach { error =>
            val failedItem = supporterRatePlanItems(error.getId.toInt)
            SafeLogger.error(
              scrub"Error writing to the queue\nFor item with body: ${failedItem.asJson}\nError message: ${error.getMessage}",
            )
          }
          alarmService.triggerSQSWriteAlarm
        }
      case Failure(exception) =>
        SafeLogger.error(
          scrub"Error writing to the queue\nAn exception was thrown by SQS when writing this list of items: ${supporterRatePlanItems.asJson.spaces2}",
          exception,
        )
        alarmService.triggerSQSWriteAlarm
    }
    ()
  }
}

object SqsService {
  import scala.concurrent.ExecutionContext.Implicits.global
  def apply(stage: Stage) = {
    val queueName = s"supporter-product-data-${stage.value}"
    SafeLogger.info(s"Creating SqsService for SQS queue $queueName")
    new SqsService(queueName, new AlarmService(stage))
  }
}
