package com.gu.acquisition.instances

import io.circe.Json
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event._
import org.scalatest.{Matchers, WordSpecLike}

class AcquisitionInstancesSpec extends WordSpecLike with Matchers {

  val oneOffContributionAcquisition = Acquisition(
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
    source = Some(AcquisitionSource.GuardianWeb),
    platform = Some(Platform.Contribution)
  )

  val oneOffContributionAcquisitionJson = Json.obj(
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
    "source" -> Json.fromString("GUARDIAN_WEB"),
    "platform" -> Json.fromString("CONTRIBUTION")
  )

  "An acquisition event for a one-off contribution" should {
    import io.circe.syntax._
    import com.gu.acquisition.instances.acquisition._

    "be able to be encoded to JSON" in {
      oneOffContributionAcquisition.asJson shouldEqual oneOffContributionAcquisitionJson
    }

    "be able to be decoded from JSON" in {
      oneOffContributionAcquisitionJson.as[Acquisition] shouldEqual Right(oneOffContributionAcquisition)
    }
  }

  val recurringContributionAcquisition = Acquisition(
    product = Product.RecurringContribution,
    paymentFrequency = PaymentFrequency.Monthly,
    currency = "GBP",
    amount = 10.0,
    paymentProvider = Some(PaymentProvider.Paypal),
    campaignCode = Some(Set("campaign_code")),
    abTests = Some(AbTestInfo(Set(AbTest("test_name", "variant_name")))),
    countryCode = Some("UK"),
    componentId = Some("epic"),
    componentTypeV2 = Some(ComponentType.AcquisitionsEpic),
    source = Some(AcquisitionSource.GuardianWeb),
    platform = Some(Platform.Support)
  )

  val recurringContributionAcquisitionJson = Json.obj(
    "product" -> Json.fromString("RECURRING_CONTRIBUTION"),
    "paymentFrequency" -> Json.fromString("MONTHLY"),
    "currency" -> Json.fromString("GBP"),
    "amount" -> Json.fromDouble(10.0d).get,
    "paymentProvider" -> Json.fromString("PAYPAL"),
    "campaignCode" -> Json.fromValues(Set(Json.fromString("campaign_code"))),
    "abTests" -> Json.obj("tests" -> Json.fromValues(
      List(Json.obj(
        "name" -> Json.fromString("test_name"),
        "variant" -> Json.fromString("variant_name")))
    )),
    "countryCode" -> Json.fromString("UK"),
    "componentId" -> Json.fromString("epic"),
    "componentTypeV2" -> Json.fromString("ACQUISITIONS_EPIC"),
    "source" -> Json.fromString("GUARDIAN_WEB"),
    "platform" -> Json.fromString("SUPPORT")
  )

  "An acquisition event for a recurring contribution" should {
    import io.circe.syntax._
    import com.gu.acquisition.instances.acquisition._

    "be able to be encoded to JSON" in {
      recurringContributionAcquisition.asJson shouldEqual recurringContributionAcquisitionJson
    }

    "be able to be decoded from JSON" in {
      recurringContributionAcquisitionJson.as[Acquisition] shouldEqual Right(recurringContributionAcquisition)
    }
  }

  val printSubscriptionAcquisition = Acquisition(
    product = Product.PrintSubscription,
    paymentFrequency = PaymentFrequency.Quarterly,
    currency = "GBP",
    amount = 10.0,
    paymentProvider = Some(PaymentProvider.Stripe),
    campaignCode = Some(Set("campaign_code")),
    abTests = Some(AbTestInfo(Set(AbTest("test_name", "variant_name")))),
    countryCode = Some("UK"),
    componentId = Some("epic"),
    componentTypeV2 = Some(ComponentType.AcquisitionsEpic),
    source = Some(AcquisitionSource.GuardianWeb),
    platform = Some(Platform.Subscribe),
    discountLengthInMonths = Some(2),
    discountPercentage = Some(21.5),
    labels = Some(Set("some-special-promo")),
    promoCode = Some("DSB01"),
    printOptions = Some(
      PrintOptions(
        product = PrintProduct.GuardianWeekly,
        deliveryCountryCode = "GB"
      )
    )

  )

  val printSubscriptionAcquisitionJson = Json.obj(
    "product" -> Json.fromString("PRINT_SUBSCRIPTION"),
    "paymentFrequency" -> Json.fromString("QUARTERLY"),
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
    "source" -> Json.fromString("GUARDIAN_WEB"),
    "platform" -> Json.fromString("SUBSCRIBE"),
    "discountLengthInMonths" -> Json.fromInt(2),
    "discountPercentage" -> Json.fromDouble(21.5d).get,
    "labels" -> Json.fromValues(Set(Json.fromString("some-special-promo"))),
    "promoCode" -> Json.fromString("DSB01"),
    "printOptions" -> Json.obj(
      "product" -> Json.fromString("GUARDIAN_WEEKLY"),
      "deliveryCountryCode" -> Json.fromString("GB")
    )
  )

  "An acquisition event for a print subscription" should {
    import io.circe.syntax._
    import com.gu.acquisition.instances.acquisition._

    "be able to be encoded to JSON" in {
      printSubscriptionAcquisition.asJson shouldEqual printSubscriptionAcquisitionJson
    }

    "be able to be decoded from JSON" in {
      printSubscriptionAcquisitionJson.as[Acquisition] shouldEqual Right(printSubscriptionAcquisition)
    }
  }
}