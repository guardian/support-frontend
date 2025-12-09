package utils

import com.gu.i18n.{Country, Currency}
import com.gu.support.acquisitions.{AbTest, AcquisitionData, OphanIds, QueryParameter, ReferrerAcquisitionData}
import com.gu.support.workers.states.{AnalyticsInfo, CreatePaymentMethodState}
import com.gu.support.workers.{
  Address,
  DigitalPack,
  DirectDebitPaymentFields,
  Monthly,
  PayPal,
  PayPalPaymentFields,
  PaymentFields,
  ProductInformation,
  StripePaymentFields,
  User,
}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

import java.util.UUID

class SupportWorkersUtilsTest extends AnyFlatSpec with Matchers {
  "buildExecutionName" should "include the TestUser prefix when it's a test user" in {
    val state = SupportWorkersUtilsTestData.generateState(PayPalPaymentFields("fake-baid"))

    val name = SupportWorkersUtils.buildExecutionName(isTestUser = true, state = state)

    name should be("TestUser-Monthly-DigitalPack-GBP-PayPal")
  }

  it should "not include the TestUser prefix when it's a not test user" in {
    val state = SupportWorkersUtilsTestData.generateState(PayPalPaymentFields("fake-baid"))

    val name = SupportWorkersUtils.buildExecutionName(isTestUser = false, state = state)

    name should be("Monthly-DigitalPack-GBP-PayPal")
  }

  it should "change the name when the user in in the PayPal Complete Payments AB test and paying with PayPal" in {
    val abTests = Set(
      AbTest("paypalCompletePaymentsWithBAID", "variant"),
    )
    val acquisitionData = SupportWorkersUtilsTestData.generateAcquisitionData(abTests)
    val state = SupportWorkersUtilsTestData.generateState(PayPalPaymentFields("fake-baid"), acquisitionData)

    val name = SupportWorkersUtils.buildExecutionName(isTestUser = false, state = state)

    name should be("Monthly-DigitalPack-GBP-PayPalCPWithBAID")
  }

  it should "not change the name when the user in in the PayPal Complete Payments AB test but not paying with PayPal" in {
    val abTests = Set(
      AbTest("paypalCompletePaymentsWithBAID", "variant"),
    )
    val acquisitionData = SupportWorkersUtilsTestData.generateAcquisitionData(abTests)
    val state = SupportWorkersUtilsTestData.generateState(DirectDebitPaymentFields("a", "b", "c", "d"), acquisitionData)

    val name = SupportWorkersUtils.buildExecutionName(isTestUser = false, state = state)

    name should be("Monthly-DigitalPack-GBP-DirectDebit")
  }
}

object SupportWorkersUtilsTestData {
  def generateAcquisitionData(abTests: Set[AbTest] = Set.empty): Option[AcquisitionData] = {
    Some(
      AcquisitionData(
        ophanIds = OphanIds(
          pageviewId = None,
          browserId = None,
        ),
        supportAbTests = abTests,
        referrerAcquisitionData = ReferrerAcquisitionData(
          campaignCode = None,
          referrerPageviewId = None,
          referrerUrl = None,
          componentId = None,
          componentType = None,
          source = None,
          abTests = None,
          queryParameters = None,
          hostname = None,
          gaClientId = None,
          userAgent = None,
          ipAddress = None,
          labels = None,
        ),
      ),
    )
  }

  def generateState(paymentFields: PaymentFields, acquisitionData: Option[AcquisitionData] = None) = {
    CreatePaymentMethodState(
      requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      user =
        User("111222", "example@theguardian.com", None, "A", "B", Address(None, None, None, None, None, Country.UK)),
      giftRecipient = None,
      product = DigitalPack(Currency.GBP, Monthly),
      productInformation = Some(ProductInformation("DigitalSubscription", "Monthly", None, None, None, None, None)),
      analyticsInfo = AnalyticsInfo(false, PayPal),
      paymentFields = paymentFields,
      firstDeliveryDate = None,
      appliedPromotion = None,
      csrUsername = None,
      salesforceCaseId = None,
      acquisitionData = acquisitionData,
      ipAddress = "127.0.0.1",
      userAgent = "TestAgent",
      similarProductsConsent = None,
    )
  }
}
