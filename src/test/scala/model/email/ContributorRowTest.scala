package model.email

import io.circe.parser._
import org.scalatest.{FlatSpec, Matchers}

class ContributorRowTest extends FlatSpec with Matchers {
  it should "serialize to json" in {
    val Right(expected) = parse(
      """
        |{
        |  "To" : {
        |    "Address" : "email@email.email",
        |    "SubscriberKey" : "email@email.email",
        |    "ContactAttributes" : {
        |      "SubscriberAttributes" : {
        |        "EmailAddress" : "email@email.email",
        |        "edition" : "uk"
        |      }
        |    }
        |  },
        |  "DataExtensionName" : "contribution-thank-you",
        |  "IdentityUserId" : "123"
        |}""".stripMargin
    )

    val Right(result) =  parse(ContributorRow("email@email.email", "GBP", 123l).toJsonContributorRowSqsMessage)
    result shouldBe expected
  }
}
