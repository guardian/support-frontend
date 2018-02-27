package com.gu.emailservices

import com.amazonaws.regions.Regions
import com.amazonaws.services.sqs.AmazonSQSAsyncClientBuilder
import com.amazonaws.services.sqs.model.{SendMessageRequest, SendMessageResult}
import com.gu.aws.{AwsAsync, CredentialsProvider}
import com.typesafe.scalalogging.StrictLogging
import org.joda.time.DateTime
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Failure, Success}

case class EmailFields(
    email: String,
    created: DateTime,
    amount: BigDecimal,
    currency: String,
    edition: String,
    name: String,
    product: String
) {
  def payload(dataExtensionName: String): String =
    s"""
       |{
       |  "To": {
       |    "Address": "$email",
       |    "SubscriberKey": "$email",
       |    "ContactAttributes": {
       |      "SubscriberAttributes": {
       |        "EmailAddress": "$email",
       |        "created": "$created",
       |        "amount": $amount,
       |        "currency": "$currency",
       |        "edition": "$edition",
       |        "name": "$name",
       |        "product": "$product"
       |      }
       |    }
       |  },
       |  "DataExtensionName": "$dataExtensionName"
       |}
    """.stripMargin
}

class EmailService(config: EmailConfig) extends StrictLogging {
  private val sqsClient = AmazonSQSAsyncClientBuilder
    .standard
    .withCredentials(CredentialsProvider)
    .withRegion(Regions.EU_WEST_1)
    .build()

  private val queueUrl = sqsClient.getQueueUrl(config.queueName).getQueueUrl

  def send(fields: EmailFields): Future[SendMessageResult] = {
    logger.info(s"Sending message to SQS queue $queueUrl")
    val messageResult = AwsAsync(sqsClient.sendMessageAsync, new SendMessageRequest(queueUrl, fields.payload(config.dataExtensionName)))
    messageResult.onComplete {
      case Success(result) => logger.info(s"Successfully sent message to $queueUrl: $result")
      case Failure(throwable) => logger.error(s"Failed to send message due to $queueUrl due to:", throwable)
    }
    messageResult
  }

}

