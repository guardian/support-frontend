package com.gu.acquisition.services

import cats.implicits._
import com.gu.acquisition.model._
import com.typesafe.scalalogging.LazyLogging
import okhttp3.OkHttpClient
import ophan.thrift.event._
import org.scalatest.{AsyncWordSpecLike, Matchers}

class GAServiceSpec extends AsyncWordSpecLike with Matchers with LazyLogging {

  implicit val client: OkHttpClient = new OkHttpClient()

  val service = new GAService

  private val digiPack = Acquisition(
    product = ophan.thrift.event.Product.DigitalSubscription,
    paymentFrequency = PaymentFrequency.Monthly,
    currency = "GBP",
    amount = 11.99,
    paymentProvider = Some(PaymentProvider.Stripe),
    campaignCode = Some(Set("FAKE_ACQUISITION_EVENT")),
    abTests = Some(AbTestInfo(Set(AbTest("test_name", "variant_name"), AbTest("second_test", "control")))),
    countryCode = Some("US"),
    referrerPageViewId = None,
    referrerUrl = None,
    componentId = None,
    componentTypeV2 = None,
    source = None
  )
  private val weekly = Acquisition(
    product = ophan.thrift.event.Product.PrintSubscription,
    paymentFrequency = PaymentFrequency.Monthly,
    currency = "GBP",
    amount = 24.86,
    paymentProvider = Some(PaymentProvider.Stripe),
    campaignCode = Some(Set("FAKE_ACQUISITION_EVENT")),
    abTests = Some(AbTestInfo(Set(AbTest("test_name", "variant_name"), AbTest("second_test", "control")))),
    countryCode = Some("US"),
    referrerPageViewId = None,
    referrerUrl = None,
    componentId = None,
    componentTypeV2 = None,
    source = None,
    printOptions = Some(PrintOptions(PrintProduct.GuardianWeekly, "US"))
  )
  private val contribution = Acquisition(
    product = ophan.thrift.event.Product.RecurringContribution,
    paymentFrequency = PaymentFrequency.Monthly,
    currency = "GBP",
    amount = 5,
    paymentProvider = Some(PaymentProvider.Stripe),
    campaignCode = Some(Set("FAKE_ACQUISITION_EVENT")),
    abTests = Some(AbTestInfo(Set(AbTest("test_name", "variant_name"), AbTest("second_test", "control")))),
    countryCode = Some("US"),
    referrerPageViewId = None,
    referrerUrl = None,
    componentId = None,
    componentTypeV2 = None,
    source = None,
  )
  val gaData = GAData("support.code.dev-theguardian.com", "GA1.1.1633795050.1537436107", None, None)
  val ophanIds = OphanIds(None, Some("123456789"), Some("987654321"))
  val submission = AcquisitionSubmission(
    OphanIds(None, Some("123456789"), Some("987654321")),
    gaData,
    weekly
  )


  "A GAService" should {
    "get the correct Client ID" in {
      service.sanitiseClientId("GA1.1.1633795050.1537436107") shouldEqual Right("1633795050")
      service.sanitiseClientId("").isLeft shouldBe true
      service.sanitiseClientId("1234567") shouldEqual Right("1234567")
    }
    "build a correct payload" in {
      service.buildPayload(submission).map{
        payload =>
          val payloadMap = payloadAsMap(payload)
          payloadMap.get("ec") shouldEqual Some("PrintConversion")
          payloadMap.get("ea") shouldEqual Some("GuardianWeekly")
          payloadMap.get("cu") shouldEqual Some("GBP")
          payloadMap.get("cid") shouldEqual Some("1633795050")
          payloadMap.get("pr1ca") shouldEqual Some("PrintSubscription")
      }.isRight shouldBe true
    }

    "build a correct ABTest payload" in {
      val tp = service.buildABTestPayload(digiPack.abTests)
      tp shouldEqual "test_name=variant_name,second_test=control"
    }

    "build a correct OptimizeTests payload" in {
      var abTests = Some(AbTestInfo(Set(AbTest("optimize$$test_name", "0"), AbTest("optimize$$second_test", "1"))))
      val tp = service.buildOptimizeTestsPayload(abTests)
      tp.get._1 shouldEqual "test_name,second_test"
      tp.get._2 shouldEqual "0,1"
    }

    "get the correct conversion category" in {
      service.getConversionCategory(digiPack) shouldEqual ConversionCategory.DigitalConversion
      service.getConversionCategory(weekly) shouldEqual ConversionCategory.PrintConversion
      service.getConversionCategory(contribution) shouldEqual ConversionCategory.ContributionConversion
    }

    //You can use this test to submit a request and the watch it in the Real-Time reports in the 'Support CODE' GA view.
    "submit a request" ignore {
      service.submit(submission).fold(
        serviceError => {
          logger.error(s"$serviceError")
          fail()
        },
        _ => succeed
      )
    }
  }

  private def payloadAsMap(payload: String) = payload.split("&").map(text => text.split("=")).map(a => a(0) -> a(1)).toMap
}
