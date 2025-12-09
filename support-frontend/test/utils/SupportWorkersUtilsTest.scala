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
    val state =
      SupportWorkersUtilsTestData.generateState(paymentFields = PayPalPaymentFields("fake-baid"), isTestUser = true)

    val name = SupportWorkersUtils.buildExecutionName(state = state)

    name should be("TestUser-Monthly-DigitalPack-GBP-PayPal")
  }

  it should "not include the TestUser prefix when it's a not test user" in {
    val state =
      SupportWorkersUtilsTestData.generateState(paymentFields = PayPalPaymentFields("fake-baid"), isTestUser = false)

    val name = SupportWorkersUtils.buildExecutionName(state = state)

    name should be("Monthly-DigitalPack-GBP-PayPal")
  }

  it should "change the name when the user in in the PayPal Complete Payments AB test and paying with PayPal" in {
    val abTests = Set(
      AbTest("paypalCompletePaymentsWithBAID", "variant"),
    )
    val acquisitionData = SupportWorkersUtilsTestData.generateAcquisitionData(abTests)
    val state = SupportWorkersUtilsTestData.generateState(
      paymentFields = PayPalPaymentFields("fake-baid"),
      isTestUser = false,
      acquisitionData = acquisitionData,
    )

    val name = SupportWorkersUtils.buildExecutionName(state = state)

    name should be("Monthly-DigitalPack-GBP-PayPalCPWithBAID")
  }

  it should "not change the name when the user in in the PayPal Complete Payments AB test but not paying with PayPal" in {
    val abTests = Set(
      AbTest("paypalCompletePaymentsWithBAID", "variant"),
    )
    val acquisitionData = SupportWorkersUtilsTestData.generateAcquisitionData(abTests)
    val state = SupportWorkersUtilsTestData.generateState(
      paymentFields = DirectDebitPaymentFields("a", "b", "c", "d"),
      isTestUser = false,
      acquisitionData = acquisitionData,
    )

    val name = SupportWorkersUtils.buildExecutionName(state = state)

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

  def generateState(
      paymentFields: PaymentFields,
      isTestUser: Boolean,
      acquisitionData: Option[AcquisitionData] = None,
  ) = {
    CreatePaymentMethodState(
      requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      user = User(
        id = "111222",
        primaryEmailAddress = "example@theguardian.com",
        title = None,
        firstName = "A",
        lastName = "B",
        billingAddress = Address(None, None, None, None, None, Country.UK),
        isTestUser = isTestUser,
      ),
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
