package com.gu.acquisition.services

import com.gu.acquisition.model.{AcquisitionSubmission, GAData, OphanIds}
import okhttp3.OkHttpClient
import ophan.thrift.event._
import org.scalatest.{Matchers, WordSpecLike}

class GAServiceSpec  extends WordSpecLike with Matchers {

  implicit val client: OkHttpClient = new OkHttpClient()

  val service = new GAService("UA-12345678-9")

  "A GAService" should {
    "build a correct payload" in {
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
          abTests = Some(AbTestInfo(Set(AbTest("test_name", "variant_name")))),
          countryCode = Some("US"),
          referrerPageViewId = None,
          referrerUrl = None,
          componentId = None,
          componentTypeV2 = None,
          source = None
        )
      )

      val payload = service.buildPayload(submission)
      payload shouldEqual "ec=AcquisitionConversion&ev=20.0&pr1nm=Contribution&pa=purchase&t=event&cu=GBP&el=OneOff&v=1&ea=Contribution&uid=987654321&pr1qt=1&tid=UA-12345678-9&ti=7bc5c50d-85ce-49ef-9647-96c27c3809b9&pr1pr=20.0"
        //"v=1&t=event&tid=UA-12345678-9&cid=123456789&dh=support.code.dev-theguardian.com&ec=AcquisitionConversion&ea=RecurringContribution&ti=MjXBgOox8DY1kNbR3c93ddddd&pa=purchase&pr1nm=RecurringContribution&el=monthly&ev=5&cu=GBP&pr1pr=5&pr1qt=1"
    }
  }
}
