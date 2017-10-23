package com.gu.acquisition.instances

import io.circe.Json
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event._
import org.scalatest.{Matchers, WordSpecLike}

class AcquisitionInstancesSpec extends WordSpecLike with Matchers {

  val acquisition = Acquisition(
    product = Product.Contribution,
    paymentFrequency = PaymentFrequency.OneOff,
    currency = "GBP",
    amount = 10.0,
    paymentProvider = Some(PaymentProvider.Stripe),
    campaignCode = Some(Set("campaign_code")),
    abTests = Some(AbTestInfo(Set(AbTest("test_name", "variant_name")))),
    countryCode = Some("UK"),
    componentId = Some("epic"),
    componentTypeV2 = Some(ComponentType.AcquisitionsEpic),
    source = Some(AcquisitionSource.GuardianWeb)
  )

  val acquisitionJson = Json.obj(
    "product" -> Json.fromString("CONTRIBUTION"),
    "paymentFrequency" -> Json.fromString("ONE_OFF"),
    "currency" -> Json.fromString("GBP"),
    "amount" -> Json.fromDouble(10.0d).get,
    "paymentProvider" -> Json.fromString("STRIPE"),
    "campaignCode" -> Json.fromValues(Set(Json.fromString("campaign_code"))),
    "abTests" -> Json.obj("tests" -> Json.fromValues(
      List(Json.obj(
        "name" -> Json.fromString("test_name"),
        "variant" -> Json.fromString("variant_name")))
    )),
    "countryCode" -> Json.fromString("UK"),
    "componentId" -> Json.fromString("epic"),
    "componentTypeV2" -> Json.fromString("ACQUISITIONS_EPIC"),
    "source" -> Json.fromString("GUARDIAN_WEB")
  )

  "An acquisition event" should {
    import io.circe.syntax._
    import com.gu.acquisition.instances.acquisition._

    "be able to be encoded to JSON" in {
      acquisition.asJson shouldEqual acquisitionJson
    }

    "be able to be decoded from JSON" in {
      acquisitionJson.as[Acquisition] shouldEqual Right(acquisition)
    }
  }
}