package com.gu.services

import com.gu.monitoring.SafeLogging
import com.gu.supporterdata.model.{ContributionAmount, Stage, SupporterRatePlanItem}
import com.gu.aws.CredentialsProvider
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax.EncoderOps
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.sqs.model.{
  GetQueueUrlRequest,
  SendMessageBatchRequest,
  SendMessageBatchRequestEntry,
}
import software.amazon.awssdk.services.sqs.SqsClient

import scala.concurrent.ExecutionContext
import scala.jdk.CollectionConverters._
import scala.util.{Failure, Success, Try}

class SqsService(queueName: String, alarmService: AlarmService)(implicit val executionContext: ExecutionContext)
    extends SafeLogging {
  implicit val encoder: Encoder[SupporterRatePlanItem] = deriveEncoder
  implicit val contributionAmountEncoder: Encoder[ContributionAmount] = deriveEncoder
  private val sqsClient = SqsClient
    .builder()
    .region(Region.EU_WEST_1)
    .credentialsProvider(CredentialsProvider)
    .build()

  private val getQueueUrlRequest = GetQueueUrlRequest
    .builder()
    .queueName(queueName)
    .build()
  private val queueUrl = sqsClient.getQueueUrl(getQueueUrlRequest).queueUrl

  def sendBatch(supporterRatePlanItems: List[(SupporterRatePlanItem, Int)]) = {
    logger.info(s"Sending message batch with ${supporterRatePlanItems.length} items to SQS queue $queueUrl")

    val batchRequestEntries = supporterRatePlanItems.map { case (item, index) =>
      new SendMessageBatchRequestEntry(index.toString, item.asJson.noSpaces)
    }

    val batchRequest = new SendMessageBatchRequest(queueUrl, batchRequestEntries.asJava)
    sqsClient.sendMessageBatch(batchRequest)

    Try(sqsClient.sendMessageBatch(batchRequest)) match {
      case Success(batchResult) =>
        val failures = batchResult.failed.asScala.toList
        if (failures.nonEmpty) {
          failures.foreach { error =>
            val failedItem = supporterRatePlanItems(error.id.toInt)
            logger.error(
              scrub"Error writing to the queue\nFor item with body: ${failedItem.asJson}\nError message: ${error.message}",
            )
          }
          alarmService.triggerSQSWriteAlarm
        }
      case Failure(exception) =>
        logger.error(
          scrub"Error writing to the queue\nAn exception was thrown by SQS when writing this list of items: ${supporterRatePlanItems.asJson.spaces2}",
          exception,
        )
        alarmService.triggerSQSWriteAlarm
    }
    ()
  }
}

object SqsService extends SafeLogging {
  import scala.concurrent.ExecutionContext.Implicits.global
  def apply(stage: Stage) = {
    val queueName = s"supporter-product-data-${stage.value}"
    logger.info(s"Creating SqsService for SQS queue $queueName")
    new SqsService(queueName, new AlarmService(stage))
  }
}
