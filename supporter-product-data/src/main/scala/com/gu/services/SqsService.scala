package com.gu.services

import com.amazonaws.regions.Regions
import com.amazonaws.services.sqs.AmazonSQSAsyncClientBuilder
import com.amazonaws.services.sqs.model.{SendMessageRequest, SendMessageResult}
import com.gu.aws.{AwsAsync, CredentialsProvider}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.supporterdata.model.{Stage, SupporterRatePlanItem}
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax.EncoderOps
import scala.concurrent.{ExecutionContext, Future}

class SqsService(queueName: String)(implicit val executionContext: ExecutionContext) {

  private val sqsClient = AmazonSQSAsyncClientBuilder.standard
    .withCredentials(CredentialsProvider)
    .withRegion(Regions.EU_WEST_1)
    .build()

  private val queueUrl = sqsClient.getQueueUrl(queueName).getQueueUrl

  def send(supporterRatePlanItem: SupporterRatePlanItem): Future[SendMessageResult] = {
    SafeLogger.info(s"Sending message to SQS queue $queueUrl")
    implicit val encoder: Encoder[SupporterRatePlanItem] = deriveEncoder
    val payload = supporterRatePlanItem.asJson.noSpaces
    SafeLogger.info(s"message content is: $payload")
    val messageResult = AwsAsync(sqsClient.sendMessageAsync, new SendMessageRequest(queueUrl, payload))
    messageResult
      .recover { case throwable =>
        SafeLogger.error(scrub"Failed to send message due to $queueUrl due to:", throwable)
        throw throwable
      }
      .map { result =>
        SafeLogger.info(s"Successfully sent message to $queueUrl: $result")
        result
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
