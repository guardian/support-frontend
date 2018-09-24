package com.gu.acquisition.services

import cats.implicits._
import com.gu.acquisition.model.{AcquisitionSubmission, GAData, OphanIds}
import okhttp3.OkHttpClient
import ophan.thrift.event._
import org.scalatest.{AsyncWordSpecLike, Matchers}

class GAServiceSpec extends AsyncWordSpecLike with Matchers {

  implicit val client: OkHttpClient = new OkHttpClient()

  val service = new GAService

  val submission = AcquisitionSubmission(
    OphanIds(None, Some("123456789"), Some("987654321")),
    GAData(Some("support.code.dev-theguardian.com"), None, None),
    Acquisition(
      product = ophan.thrift.event.Product.Contribution,
      paymentFrequency = PaymentFrequency.OneOff,
      currency = "GBP",
      amount = 20d,
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
  )


  "A GAService" should {
    "build a correct payload" in {
      val payload = service.buildPayload(submission)
      val payloadMap = payloadAsMap(payload)
      payloadMap.get("ec") shouldEqual Some("AcquisitionConversion")
      payloadMap.get("ea") shouldEqual Some("Contribution")
      payloadMap.get("cu") shouldEqual Some("GBP")
    }

    "build a correct ABTest payload" in {
      val tp = service.buildABTestPayload(submission.acquisition.abTests)
      tp shouldEqual "test_name=variant_name,second_test=control"
    }

    //You can use this test to submit a request and the watch it in the Real-Time reports in the 'Support CODE' GA view.
    "submit a request" in {
      service.submit(submission).fold(
        serviceError => fail(),
        acquisitionSubmission => succeed
      )
    }
  }

  private def payloadAsMap(payload: String) = payload.split("&").map(text => text.split("=")).map(a => a(0) -> a(1)).toMap
}
