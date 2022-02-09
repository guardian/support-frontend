package model.email

import java.text.SimpleDateFormat
import java.time.Instant
import java.util.Date

import io.circe.parser._
import model.PaymentProvider
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.must.Matchers

class ContributorRowTest extends AnyFlatSpec with Matchers {
  it should "serialize to json" in {
    val formattedDate = new SimpleDateFormat("d MMMM yyyy").format(Date.from(Instant.now))
    val Right(expected) = parse(
      s"""
        |{
        |  "To" : {
        |    "Address" : "email@email.email",
        |    "SubscriberKey" : "email@email.email",
        |    "ContactAttributes" : {
        |      "SubscriberAttributes" : {
        |        "EmailAddress" : "email@email.email",
        |        "edition" : "uk",
        |        "payment method": "PayPal",
        |        "first_name": "Peter",
        |        "amount": "5.10",
        |        "currency": "£",
        |        "date_of_payment": "$formattedDate"
        |      }
        |    }
        |  },
        |  "DataExtensionName" : "contribution-thank-you",
        |  "IdentityUserId" : "123"
        |}""".stripMargin,
    )

    val Right(result) = parse(
      ContributorRow(
        "email@email.email",
        "GBP",
        123L,
        PaymentProvider.Paypal,
        Some("Peter"),
        BigDecimal(5.1),
      ).toJsonContributorRowSqsMessage,
    )
    result mustBe expected
  }
}
