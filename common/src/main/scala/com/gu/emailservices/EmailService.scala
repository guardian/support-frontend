package com.gu.emailservices

import com.amazonaws.regions.Regions
import com.amazonaws.services.sqs.AmazonSQSAsyncClientBuilder
import com.amazonaws.services.sqs.model.{SendMessageRequest, SendMessageResult}
import com.gu.aws.{AwsAsync, CredentialsProvider}
import org.joda.time.DateTime

import scala.concurrent.Future

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
       |      "EmailAddress": "$email",
       |      "created": "$created",
       |      "amount": $amount,
       |      "currency": "$currency",
       |      "edition": "$edition",
       |      "name": "$name",
       |      "product": "$product"
       |    }
       |  },
       |  "DataExtensionName": "$dataExtensionName"
       |}
    """.stripMargin
}

class EmailService(config: EmailConfig) {
  private val sqsClient = AmazonSQSAsyncClientBuilder
    .standard
    .withCredentials(CredentialsProvider)
    .withRegion(Regions.EU_WEST_1)
    .build()

  private val queueUrl = sqsClient.getQueueUrl(config.queueName).getQueueUrl

  def send(fields: EmailFields): Future[SendMessageResult] =
    AwsAsync(sqsClient.sendMessageAsync, new SendMessageRequest(queueUrl, fields.payload(config.dataExtensionName)))
}

