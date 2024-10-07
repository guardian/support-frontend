package services

import io.circe.Json

import java.time.LocalDateTime
import java.util.UUID
import model.{Currency, PaymentProvider, PaymentStatus}
import model.db.ContributionData
import services.ContributionsStoreQueueService.NewContributionData
import io.circe.parser._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.must.Matchers

class ContributionsStoreServiceSpec extends AnyFlatSpec with Matchers {

  val uuid: UUID = UUID.randomUUID()

  val contributionData: ContributionData = ContributionData(
    paymentProvider = PaymentProvider.Paypal,
    paymentStatus = PaymentStatus.Paid,
    paymentId = "paymentId",
    identityId = Some("1"),
    email = "test@test.com",
    created = LocalDateTime.of(2000, 1, 1, 0, 0, 0),
    currency = Currency.GBP,
    amount = 20,
    countryCode = Some("GB"),
    countrySubdivisionCode = None,
    contributionId = uuid,
    postalCode = Some("N1 9GU"),
  )

  val expectedJson: Json = parse(
    s"""|{
      |  "newContributionData" : {
      |    "paymentProvider" : "Paypal",
      |    "paymentStatus" : "Paid",
      |    "paymentId" : "paymentId",
      |    "identityId" : "1",
      |    "email" : "test@test.com",
      |    "created" : "2000-01-01T00:00",
      |    "currency" : "GBP",
      |    "amount" : 20,
      |    "countryCode" : "GB",
      |    "countrySubdivisionCode" : null,
      |    "contributionId" : "$uuid",
      |    "postalCode" : "N1 9GU"
      |  }
      |}""".stripMargin,
  ).toOption.get

  it should "serialize ContributionData" in {
    ContributionsStoreQueueService.Message.toJson(NewContributionData(contributionData)) must be(expectedJson)
  }
}
