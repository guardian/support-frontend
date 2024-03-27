package com.gu.emailservices

import com.gu.aws.CredentialsProvider
import com.gu.monitoring.SafeLogging
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.sqs._
import software.amazon.awssdk.services.sqs.model.{GetQueueUrlRequest, SendMessageRequest}

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success, Try}

class EmailService(emailQueueName: String)(implicit val executionContext: ExecutionContext) extends SafeLogging {

  private val sqsClient = SqsClient
    .builder()
    .credentialsProvider(CredentialsProvider)
    .region(Region.EU_WEST_1)
    .build()

  private val queueUrl = sqsClient
    .getQueueUrl(
      GetQueueUrlRequest.builder().queueName(emailQueueName).build(),
    )
    .queueUrl()

  def send(fields: EmailFields): Unit = {
    logger.info(s"Sending message to SQS queue $queueUrl")
    val payload = fields.payload
    logger.info(s"message content is: $payload")
    val messageResult = Try {
      sqsClient.sendMessage(
        SendMessageRequest
          .builder()
          .queueUrl(queueUrl)
          .messageBody(payload)
          .build(),
      )
    }
    messageResult match {
      case Failure(throwable) =>
        logger.error(scrub"Failed to send message due to $queueUrl due to:", throwable)
      case Success(result) =>
        logger.info(s"Successfully sent message to $queueUrl: $result")
    }
    messageResult.get // throw exception
  }

}
