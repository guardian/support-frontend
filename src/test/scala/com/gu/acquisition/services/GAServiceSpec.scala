package com.gu.acquisition.services

import com.gu.acquisition.model.{AcquisitionSubmission, GAData, OphanIds}
import okhttp3.OkHttpClient
import ophan.thrift.event._
import org.scalatest.{AsyncWordSpecLike, Matchers, WordSpecLike}
import cats.data._
import cats.implicits._

class GAServiceSpec extends AsyncWordSpecLike with Matchers {

  implicit val client: OkHttpClient = new OkHttpClient()

  val service = new GAService("UA-51507017-5")

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
      payload shouldEqual "ec=AcquisitionConversion&ev=20.0&pr1nm=Contribution&pa=purchase&t=event&cu=GBP&el=OneOff&v=1&ea=Contribution&uid=987654321&pr1qt=1&tid=UA-12345678-9&ti=7bc5c50d-85ce-49ef-9647-96c27c3809b9&pr1pr=20.0"
      //"v=1&t=event&tid=UA-12345678-9&cid=123456789&dh=support.code.dev-theguardian.com&ec=AcquisitionConversion&ea=RecurringContribution&ti=MjXBgOox8DY1kNbR3c93ddddd&pa=purchase&pr1nm=RecurringContribution&el=monthly&ev=5&cu=GBP&pr1pr=5&pr1qt=1"
    }

    "build a correct ABTest payload" in {
      val tp = service.buildABTestPayload(submission.acquisition.abTests)
      tp shouldEqual "test_name=variant_name,second_test=control"
    }

    //You can use this test to submit a request and the watch it in the Real-Time reports in the 'Support CODE' GA view.
    "submit a request" ignore {
      service.submit(submission).fold(
        serviceError => fail(),
        acquisitionSubmission => succeed
      )
    }
  }
}
