package model.email

import io.circe.syntax._
import io.circe.generic.JsonCodec

/*
 * Variable name capitalisation due to the expected JSON structure
 * {
 *    "To":{
 *       "Address":"email@email.com",
 *       "SubscriberKey":"email@email.com"
 *    },
 *    "DataExtensionName":"contribution-thank-you"
 * }
 *
 * Email flow: payment-api -> SQS -> membership-workflow -> ExactTarget (salesforce)
 *
 */
@JsonCodec case class ContributorRowSqsMessage(
  To: ToSqsMessage,
  DataExtensionName: String
)

@JsonCodec case class ToSqsMessage(
  Address: String,
  SubscriberKey: String
)

case class ContributorRow(email: String) {

  def toJsonContributorRowSqsMessage: String = {

    val toSqsMessage = ToSqsMessage(
      Address = email,
      SubscriberKey = email
    )

    ContributorRowSqsMessage(
      To = toSqsMessage,
      DataExtensionName = "contribution-thank-you").asJson.toString()
  }
}
