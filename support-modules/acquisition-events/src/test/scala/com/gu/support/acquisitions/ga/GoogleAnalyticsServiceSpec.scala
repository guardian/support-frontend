package com.gu.support.acquisitions.ga

import com.gu.i18n.{Country, Currency}
import com.gu.support.acquisitions.AbTest
import com.gu.support.acquisitions.ga.models.{ConversionCategory, GAData}
import com.gu.support.acquisitions.models.AcquisitionProduct.{DigitalSubscription, Paper, RecurringContribution}
import com.gu.support.acquisitions.models.PrintProduct.GuardianWeekly
import com.gu.support.acquisitions.models.{
  AcquisitionDataRow,
  AcquisitionProduct,
  AcquisitionType,
  PaymentFrequency,
  PaymentProvider,
  PrintOptions,
}
import com.gu.support.zuora.api.ReaderType
import com.typesafe.scalalogging.LazyLogging
import okhttp3.OkHttpClient
import org.joda.time.DateTime
import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AsyncWordSpecLike

class GoogleAnalyticsServiceSpec extends AsyncWordSpecLike with Matchers with LazyLogging {

  val service = new GoogleAnalyticsServiceLive(new OkHttpClient())

  def buildAcquisition(
      product: AcquisitionProduct,
      paymentFrequency: PaymentFrequency,
      currency: Currency,
      amount: BigDecimal,
      paymentProvider: PaymentProvider,
      campaignCode: String,
      abTests: List[AbTest],
      country: Country,
      printOptions: Option[PrintOptions] = None,
  ) = AcquisitionDataRow(
    eventTimeStamp = new DateTime(1544710504165L),
    product = product,
    amount = Some(amount),
    country = country,
    currency = currency,
    componentId = Some("MY_COMPONENT_ID"),
    componentType = None,
    campaignCode = Some(campaignCode),
    source = None,
    referrerUrl = Some("referrer-url"),
    abTests = abTests,
    paymentFrequency = paymentFrequency,
    paymentProvider = Some(paymentProvider),
    printOptions = printOptions,
    browserId = None,
    identityId = None,
    pageViewId = None,
    referrerPageViewId = None,
    labels = Nil,
    promoCode = None,
    reusedExistingPaymentMethod = false,
    readerType = ReaderType.Direct,
    acquisitionType = AcquisitionType.Purchase,
    zuoraSubscriptionNumber = None,
    zuoraAccountNumber = None,
    contributionId = None,
    paymentId = None,
    queryParameters = Nil,
    platform = None,
  )

  private val digiPack = buildAcquisition(
    product = DigitalSubscription,
    paymentFrequency = PaymentFrequency.Monthly,
    currency = Currency.GBP,
    amount = 11.99,
    paymentProvider = PaymentProvider.Stripe,
    campaignCode = "FAKE_ACQUISITION_EVENT",
    abTests = List(AbTest("test_name", "variant_name"), AbTest("second_test", "control")),
    country = Country.US,
  )
  private val weekly = buildAcquisition(
    product = Paper,
    paymentFrequency = PaymentFrequency.Monthly,
    currency = Currency.GBP,
    amount = 24.86,
    paymentProvider = PaymentProvider.Stripe,
    campaignCode = "FAKE_ACQUISITION_EVENT1,FAKE_ACQUISITION_EVENT2",
    abTests = List(AbTest("test_name", "variant_name"), AbTest("second_test", "control")),
    country = Country.US,
    printOptions = Some(PrintOptions(GuardianWeekly, Country.US)),
  )
  private val contribution = buildAcquisition(
    product = RecurringContribution,
    paymentFrequency = PaymentFrequency.Monthly,
    currency = Currency.GBP,
    amount = 5,
    paymentProvider = PaymentProvider.Stripe,
    campaignCode = "FAKE_ACQUISITION_EVENT",
    abTests = List(AbTest("test_name", "variant_name"), AbTest("second_test", "control")),
    country = Country.US,
  )
  val gaData =
    GAData("support.code.dev-theguardian.com", "GA1.1.1633795050.1537436107", Some("192.168.0.1"), Some("Mozilla/5.0"))

  "A GAService" should {
    "get the correct Client ID" in {
      GoogleAnalyticsService.sanitiseClientId("GA1.1.1633795050.1537436107") shouldEqual Right("1633795050.1537436107")
      GoogleAnalyticsService.sanitiseClientId("").isLeft shouldBe true
      GoogleAnalyticsService.sanitiseClientId("1633795050.1537436107") shouldEqual Right("1633795050.1537436107")
    }
    "build a correct payload" in {
      val maybePayload = GoogleAnalyticsService.buildPayload(weekly, 0d, gaData)
      maybePayload.isRight shouldBe true

      logger.info(maybePayload.right.get)
      val payloadMap = payloadAsMap(maybePayload.right.get)
      payloadMap.get("ec") shouldEqual Some("PrintConversion")
      payloadMap.get("ev") shouldEqual Some("24")
      payloadMap.get("ea") shouldEqual Some("GuardianWeekly")
      payloadMap.get("cu") shouldEqual Some("GBP")
      payloadMap.get("cid") shouldEqual Some("1633795050.1537436107")
      payloadMap.get("cd12") shouldEqual Some("FAKE_ACQUISITION_EVENT1,FAKE_ACQUISITION_EVENT2")
      payloadMap.get("pr1ca") shouldEqual Some("PrintSubscription")
      payloadMap.get("cd17") shouldEqual Some("Stripe")
      payloadMap.get("cd25") shouldEqual Some("false")
      payloadMap.get("cd30") shouldEqual Some("false")
      payloadMap.get("cd16") shouldEqual Some("test_name=variant_name,second_test=control")
      payloadMap.get("pr1pr") shouldEqual Some("0.0")
      payloadMap.get("dh") shouldEqual Some("support.code.dev-theguardian.com")
      payloadMap.get("pr1nm") shouldEqual Some("GuardianWeekly")
      payloadMap.get("ua") shouldEqual Some("Mozilla/5.0")
      payloadMap.get("cid") shouldEqual Some("1633795050.1537436107")
      payloadMap.get("cd26") shouldEqual Some("false")
      payloadMap.get("cd27") shouldEqual Some("GuardianWeekly")
      payloadMap.get("pr1cm15") shouldEqual Some("24.86")
      payloadMap.get("uip") shouldEqual Some("192.168.0.1")
      payloadMap.get("xid") shouldEqual Some("test_name,second_test")
      payloadMap.get("xvar") shouldEqual Some("variant_name,control")
    }

    "Include the correct successfulSubscriptionSignUp value" in {
      val contributionPayload = payloadAsMap(
        GoogleAnalyticsService
          .buildPayload(contribution, 25, gaData)
          .right
          .get,
      )

      contributionPayload.get("cm10") shouldEqual None

      val digiPackPayload = payloadAsMap(
        GoogleAnalyticsService
          .buildPayload(digiPack, 25, gaData)
          .right
          .get,
      )

      digiPackPayload.get("cm10") shouldEqual Some("1")

      val weeklyPayload = payloadAsMap(
        GoogleAnalyticsService
          .buildPayload(weekly, 25, gaData)
          .right
          .get,
      )

      weeklyPayload.get("cm10") shouldEqual Some("1")

    }

    "build a correct ABTest payload" in {
      val tp = GoogleAnalyticsService.buildABTestPayload(digiPack.abTests)
      tp shouldEqual "test_name=variant_name,second_test=control"
    }

    "build a correct OptimizeTests payload" in {
      val abTests = List(AbTest("test_name", "0"), AbTest("second_test", "1"))
      val tp = GoogleAnalyticsService.buildOptimizeTestsPayload(abTests)
      tp.testNames shouldEqual "test_name,second_test"
      tp.variantNames shouldEqual "0,1"
    }

    "get the correct conversion category" in {
      GoogleAnalyticsService.getConversionCategory(digiPack) shouldEqual ConversionCategory.DigitalConversion
      GoogleAnalyticsService.getConversionCategory(weekly) shouldEqual ConversionCategory.PrintConversion
      GoogleAnalyticsService.getConversionCategory(contribution) shouldEqual ConversionCategory.ContributionConversion
    }

    "camel case" in {
      GoogleAnalyticsService.camelCase("GUARDIAN_WEEKLY") shouldEqual "GuardianWeekly"
    }

    // You can use this test to submit a request and the watch it in the Real-Time reports in the 'Support CODE' GA view.
    "submit a request" ignore {
      service
        .submit(weekly, gaData, 5)
        .fold(
          serviceError => {
            logger.error(s"$serviceError")
            fail()
          },
          _ => succeed,
        )
    }
  }

  private def payloadAsMap(payload: String) =
    payload
      .split("&")
      .map(text => text.split("=").toList)
      .map(a => a.head -> a.tail.mkString("="))
      .toMap
}
