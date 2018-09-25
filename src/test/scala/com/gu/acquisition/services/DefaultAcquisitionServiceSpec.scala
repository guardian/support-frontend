package com.gu.acquisition.services

import com.gu.acquisition.model.errors.AnalyticsServiceError
import com.gu.acquisition.model.errors.AnalyticsServiceError.BuildError
import com.gu.acquisition.model.{AcquisitionSubmission, GAData, OphanIds}
import com.typesafe.scalalogging.LazyLogging
import okhttp3.OkHttpClient
import ophan.thrift.event._
import org.scalatest.{AsyncWordSpecLike, Matchers}

class DefaultAcquisitionServiceSpec extends AsyncWordSpecLike with Matchers with LazyLogging {
  implicit val client: OkHttpClient = new OkHttpClient()

  val service = AcquisitionService.prod

  val submission = AcquisitionSubmission(
    OphanIds(None, None, Some("None")),
    GAData("support.code.dev-theguardian.com", None, None),
    Acquisition(
      product = ophan.thrift.event.Product.RecurringContribution,
      paymentFrequency = PaymentFrequency.Monthly,
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

  "DefaultAcquisitionService" should {
    "be able to merge error `Either`s" in {
      val e1: Either[AnalyticsServiceError, AcquisitionSubmission] = Left(BuildError("blah1"))
      val e2: Either[AnalyticsServiceError, AcquisitionSubmission] = Left(BuildError("blah2"))

      val merged = service.mergeEithers(e1, e2)
      merged.isLeft shouldBe true
      merged.left.get.size shouldBe 2

    }

    "be able to merge mixed result `Either`s" in {
      val e1: Either[AnalyticsServiceError, AcquisitionSubmission] = Left(BuildError("blah1"))
      val e2: Either[AnalyticsServiceError, AcquisitionSubmission] = Right(submission)

      val merged = service.mergeEithers(e1, e2)
      merged.isLeft shouldBe true
      merged.left.get.size shouldBe 1

    }

    "be able to merge success `Either`s" in {
      val e1: Either[AnalyticsServiceError, AcquisitionSubmission] = Right(submission)
      val e2: Either[AnalyticsServiceError, AcquisitionSubmission] = Right(submission)

      val merged = service.mergeEithers(e1, e2)
      merged.isRight shouldBe true
    }
  }
}
