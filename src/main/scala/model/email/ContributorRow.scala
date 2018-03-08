package model.email

import io.circe.syntax._
import io.circe.generic.JsonCodec

/*
 * Variable name capitalisation due to the expected JSON structure
 * {
 *    "To":{
 *       "Address":"email@email.com",
 *       "SubscriberKey":"email@email.com",
 *       "ContactAttributes":{
 *          "SubscriberAttributes":{
 *             "EmailAddress":"email@email.com",
 *             "created":"2018-03-06T09:02:52.000Z",
 *             "amount":25,
 *             "currency":"EUR",
 *             "edition":"international",
 *             "name":"A-Willem Hartman"
 *          }
 *       }
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
  SubscriberKey: String,
  ContactAttributes:
  ContactAttributesSqsMessage
)

@JsonCodec case class ContactAttributesSqsMessage(
  SubscriberAttributes: SubscriberAttributesSqsMessage
)

@JsonCodec case class SubscriberAttributesSqsMessage(
  EmailAddress: String,
  created: String,
  amount: String,
  currency: String,
  edition: String,
  name: String
)

case class ContributorRow(
  email: String,
  created: String,
  amount: BigDecimal,
  currency: String,
  name: String,
  cmp: Option[String]
) {
  def edition: String = currency match {
    case "GBP" => "uk"
    case "USD" => "us"
    case "AUD" => "au"
    case _ => "international"
  }

  def toJsonContributorRowSqsMessage: String = {

    val subscriberAttributesSqsMessage = SubscriberAttributesSqsMessage(
      EmailAddress = email,
      created = created,
      amount = amount.toString(),
      currency = currency,
      edition = edition,
      name = name
    )

    val contactAttributesSqsMessage = ContactAttributesSqsMessage(
      SubscriberAttributes = subscriberAttributesSqsMessage
    )

    val toSqsMessage = ToSqsMessage(
      Address = email,
      SubscriberKey = email,
      ContactAttributes = contactAttributesSqsMessage
    )

    ContributorRowSqsMessage(
      To = toSqsMessage,
      DataExtensionName = "contribution-thank-you").asJson.toString()
  }
}
