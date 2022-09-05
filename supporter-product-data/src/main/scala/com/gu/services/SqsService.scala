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

class SqsService(queueName: String)(implicit val executionContext: ExecutionContext) {
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
    val result = sqsClient.sendMessageBatch(batchRequest)
    result.getFailed.asScala.toList.foreach { error =>
      val failedItem = supporterRatePlanItems(error.getId.toInt)
      SafeLogger.error(
        scrub"Failed to write a supporterRatePlanItem to the queue\nItem body: ${failedItem.asJson}\nError message: ${error.getMessage}",
      )
    }
  }
}

object SqsService {
  import scala.concurrent.ExecutionContext.Implicits.global
  def apply(stage: Stage) = {
    val queueName = s"supporter-product-data-${stage.value}"
    SafeLogger.info(s"Creating SqsService for SQS queue $queueName")
    new SqsService(queueName)
  }
}
