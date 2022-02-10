package model.email

import java.text.SimpleDateFormat
import java.time.Instant
import java.util.Date

import io.circe.syntax._
import io.circe.generic.JsonCodec
import model.PaymentProvider
import model.PaymentProvider._

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
    IdentityUserId: String,
)

@JsonCodec case class ToSqsMessage(
    Address: String,
    SubscriberKey: String,
    ContactAttributes: ContactAttributesSqsMessage,
)

@JsonCodec case class ContactAttributesSqsMessage(
    SubscriberAttributes: SubscriberAttributesSqsMessage,
)

@JsonCodec case class SubscriberAttributesSqsMessage(
    EmailAddress: String,
    edition: String,
    `payment method`: String,
    currency: String,
    amount: String,
    first_name: Option[String],
    date_of_payment: String,
)

case class ContributorRow(
    email: String,
    currency: String,
    identityId: Long,
    paymentMethod: PaymentProvider,
    firstName: Option[String],
    amount: BigDecimal,
) {
  private def edition: String = currency match {
    case "GBP" => "uk"
    case "USD" => "us"
    case "AUD" => "au"
    case _ => "international"
  }

  private val currencyGlyph: String = currency match {
    case "GBP" => "£"
    case "EUR" => "€"
    case "AUD" => "AU$"
    case "CAD" => "CA$"
    case "NZD" => "NZ$"
    case "SEK" => "kr"
    case "CHF" => "fr."
    case "NOK" => "kr"
    case "DKK" => "kr."
    case _ => "$"
  }

  private def formattedDate: String = new SimpleDateFormat("d MMMM yyyy").format(Date.from(Instant.now))

  private def renderPaymentMethod: String = paymentMethod match {
    case Stripe | StripeApplePay | StripePaymentRequestButton => "credit / debit card"
    case Paypal => "PayPal"
    case AmazonPay => "Amazon Pay"
  }

  def toJsonContributorRowSqsMessage: String = {
    ContributorRowSqsMessage(
      To = ToSqsMessage(
        Address = email,
        SubscriberKey = email,
        ContactAttributes = ContactAttributesSqsMessage(
          SubscriberAttributes = SubscriberAttributesSqsMessage(
            EmailAddress = email,
            edition = edition,
            `payment method` = renderPaymentMethod,
            currency = currencyGlyph,
            amount = amount.setScale(2).toString,
            first_name = firstName,
            date_of_payment = formattedDate,
          ),
        ),
      ),
      DataExtensionName = "contribution-thank-you",
      IdentityUserId = identityId.toString,
    ).asJson.toString()
  }
}
