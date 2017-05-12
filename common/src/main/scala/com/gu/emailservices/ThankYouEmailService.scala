package com.gu.emailservices

import org.joda.time.DateTime
import scala.concurrent.Future

import com.amazonaws.regions.Regions
import com.amazonaws.services.sqs.AmazonSQSAsyncClientBuilder
import com.amazonaws.services.sqs.model.{ SendMessageRequest, SendMessageResult }
import com.gu.aws.{ AwsAsync, CredentialsProvider }

case class ThankYouFields(
    email: String,
    created: DateTime,
    amount: BigDecimal,
    currency: String,
    edition: String,
    name: String
) {
  def payload: String =
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
      |      "name": "$name"
      |    }
      |  },
      |  "DataExtensionName": "contribution-thank-you"
      |}
    """.stripMargin
}

class ThankYouEmailService(thankYouEmailQueue: String) {
  private val sqsClient = AmazonSQSAsyncClientBuilder
    .standard
    .withCredentials(CredentialsProvider)
    .withRegion(Regions.EU_WEST_1)
    .build()

  private val thankYouQueueUrl = sqsClient.getQueueUrl(thankYouEmailQueue).getQueueUrl

  def send(fields: ThankYouFields): Future[SendMessageResult] =
    AwsAsync(sqsClient.sendMessageAsync, new SendMessageRequest(thankYouQueueUrl, fields.payload))

}
