package com.gu.emailservices

import com.amazonaws.regions.Regions
import com.amazonaws.services.sqs.AmazonSQSAsyncClientBuilder
import com.amazonaws.services.sqs.model.{SendMessageRequest, SendMessageResult}
import com.gu.aws.{AwsAsync, CredentialsProvider}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._

import scala.concurrent.{ExecutionContext, Future}

class EmailService(emailQueueName: String)(implicit val executionContext: ExecutionContext) {

  private val sqsClient = AmazonSQSAsyncClientBuilder.standard
    .withCredentials(CredentialsProvider)
    .withRegion(Regions.EU_WEST_1)
    .build()

  private val queueUrl = sqsClient.getQueueUrl(emailQueueName).getQueueUrl

  def send(fields: EmailFields): Future[SendMessageResult] = {
    SafeLogger.info(s"Sending message to SQS queue $queueUrl")
    val payload = fields.payload
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
