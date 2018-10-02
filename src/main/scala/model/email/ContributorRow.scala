package model.email

import io.circe.syntax._
import io.circe.generic.JsonCodec

/*
 * Variable name capitalisation due to the expected JSON structure
 * {
 *    "To":{
 *       "Address":"email@email.com",
 *       "SubscriberKey":"email@email.com"
 *       "ContactAttributes":{
 *          "SubscriberAttributes":{
 *             "EmailAddress":"email@email.com",
 *             "edition":"international"
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
  DataExtensionName: String,
  IdentityUserId: String
)

@JsonCodec case class ToSqsMessage(
  Address: String,
  SubscriberKey: String,
  ContactAttributes: ContactAttributesSqsMessage
)

@JsonCodec case class ContactAttributesSqsMessage(
  SubscriberAttributes: SubscriberAttributesSqsMessage
)

@JsonCodec case class SubscriberAttributesSqsMessage(
  EmailAddress: String,
  edition: String
)

case class ContributorRow(email: String, currency: String, identityId: Long) {
  def edition: String = currency match {
    case "GBP" => "uk"
    case "USD" => "us"
    case "AUD" => "au"
    case _ => "international"
  }

  def toJsonContributorRowSqsMessage: String = {
    ContributorRowSqsMessage(
      To = ToSqsMessage(
        Address = email,
        SubscriberKey = email,
        ContactAttributes = ContactAttributesSqsMessage(
          SubscriberAttributes = SubscriberAttributesSqsMessage(
            EmailAddress = email,
            edition = edition
          )
        )
      ),
      DataExtensionName = "contribution-thank-you",
      IdentityUserId = identityId.toString
    ).asJson.toString()
  }
}
