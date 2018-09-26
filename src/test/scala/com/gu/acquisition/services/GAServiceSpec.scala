package com.gu.acquisition.services

import cats.implicits._
import com.gu.acquisition.model.{AcquisitionSubmission, GAData, OphanIds}
import com.typesafe.scalalogging.LazyLogging
import okhttp3.OkHttpClient
import ophan.thrift.event._
import org.scalatest.{AsyncWordSpecLike, Matchers}

class GAServiceSpec extends AsyncWordSpecLike with Matchers with LazyLogging {

  implicit val client: OkHttpClient = new OkHttpClient()

  val service = new GAService

  private val acquisition = Acquisition(
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
  val gaData = GAData("support.code.dev-theguardian.com", None, None)
  val submission = AcquisitionSubmission(
    OphanIds(None, Some("123456789"), Some("987654321")),
    gaData,
    acquisition
  )


  "A GAService" should {
    "build a correct payload" in {
      val payloadWithUid = service.buildPayload(submission)
      val payloadMapWithUid = payloadAsMap(payloadWithUid)
      payloadMapWithUid.get("ec") shouldEqual Some("AcquisitionConversion")
      payloadMapWithUid.get("ea") shouldEqual Some("Contribution")
      payloadMapWithUid.get("cu") shouldEqual Some("GBP")
      // The payload should only ever have one of 'cid' and 'uid'
      // If we have an Ophan browserId then this is passed into uid
      // If not then we pass a random value in 'cid'
      payloadMapWithUid.get("uid") shouldEqual Some("987654321")
      payloadMapWithUid.get("cid") shouldEqual None

      val payloadWithCid = service.buildPayload(AcquisitionSubmission(
        OphanIds(None, None, None),
        gaData,
        acquisition
      ), Some("123"))
      val payloadMapWithCid = payloadAsMap(payloadWithCid)
      payloadMapWithCid.get("cid") shouldEqual Some("123")
      payloadMapWithCid.get("uid") shouldEqual None

    }

    "build a correct ABTest payload" in {
      val tp = service.buildABTestPayload(submission.acquisition.abTests)
      tp shouldEqual "test_name=variant_name,second_test=control"
    }

    "build a correct OptimizeTests payload" in {
      var abTests = Some(AbTestInfo(Set(AbTest("optimize$$test_name", "0"), AbTest("optimize$$second_test", "1"))))
      val tp = service.buildOptimizeTestsPayload(abTests)
      tp.get._1 shouldEqual "test_name,second_test"
      tp.get._2 shouldEqual "0,1"
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
