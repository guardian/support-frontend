package com.gu.support.workers

import com.gu.i18n.{Country, Currency}
import com.gu.support.SerialisationTestHelpers
import com.gu.support.catalog.RestOfWorld
import com.gu.support.workers.Fixtures._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionState
import com.gu.support.workers.states._
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec

import java.util.UUID

class SerialisationSpec extends AnyFlatSpec with SerialisationTestHelpers with LazyLogging with EitherValues {

  "CreatePaymentMethodState" should "deserialise correctly (comes from the support-frontend backend side)" in {
    // if you change the format, you need to make sure support workers and frontend can handle the same state
    testDecoding[CreatePaymentMethodState](createStripePaymentMethodContributionJson())
    testDecoding[CreatePaymentMethodState](createPayPalPaymentMethodContributionJson(Currency.USD))
    testDecoding[CreatePaymentMethodState](createPayPalPaymentMethodDigitalPackJson)
    testDecoding[CreatePaymentMethodState](
      createDirectDebitDigitalPackJson,
      _.acquisitionData.get.ophanIds.pageviewId shouldBe Some("jkcg440imu1c0m8pxpxe"),
    )
    testDecoding[CreatePaymentMethodState](
      createDirectDebitGuardianWeeklyJson,
      state =>
        state.product match {
          case g: GuardianWeekly => g.fulfilmentOptions shouldBe RestOfWorld
          case _ => fail()
        },
    )
  }

  "CreateSalesforceContactState" should "deserialise correctly" in {
    testDecoding[CreateSalesforceContactState](createSalesforceContactJson)
  }

  "CreateZuoraSubscription" should "deserialise correctly" in {
    testDecoding[CreateZuoraSubscriptionProductState](createContributionZuoraSubscriptionJson())
    testDecoding[CreateZuoraSubscriptionProductState](createContributionZuoraSubscriptionJson(Annual))
    testDecoding[CreateZuoraSubscriptionProductState](createDigiPackZuoraSubscriptionJson)
  }

  "FailureHandlerState" should "deserialise correctly from any lambda" in {
    import com.gu.support.workers.StatesTestData._

    testEncodeToDifferentState(preparePaymentMethodForReuseState, failureHandlerState)
    testEncodeToDifferentState(createZuoraSubscriptionState, failureHandlerState)
    testEncodeToDifferentState(createSalesforceContactState, failureHandlerState)
    testEncodeToDifferentState(createPaymentMethodState, failureHandlerState)
    // sendAcquisitionEventState does not go to failure state if it fails
  }

}
object StatesTestData {

  val failureHandlerState: FailureHandlerState = FailureHandlerStateImpl(
    requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    product = DigitalPack(Currency.GBP, Monthly),
    analyticsInfo = AnalyticsInfo(false, StripeApplePay),
    firstDeliveryDate = None,
  )

  val createPaymentMethodState = CreatePaymentMethodState(
    requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    giftRecipient = None,
    product = DigitalPack(Currency.GBP, Monthly),
    analyticsInfo = AnalyticsInfo(false, StripeApplePay),
    paymentFields = PayPalPaymentFields("baid"),
    firstDeliveryDate = None,
    appliedPromotion = None,
    csrUsername = None,
    salesforceCaseId = None,
    acquisitionData = None,
    ipAddress = "127.0.0.1",
    userAgent = "TestAgent",
    similarProductsConsent = None,
  )

  val createSalesforceContactState = CreateSalesforceContactState(
    requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    giftRecipient = None,
    product = DigitalPack(Currency.GBP, Monthly),
    analyticsInfo = AnalyticsInfo(false, StripeApplePay),
    paymentMethod = PayPalReferenceTransaction("baid", "me@somewhere.com"),
    firstDeliveryDate = None,
    appliedPromotion = None,
    csrUsername = None,
    salesforceCaseId = None,
    acquisitionData = None,
    similarProductsConsent = None,
  )

  val createZuoraSubscriptionState: CreateZuoraSubscriptionState = CreateZuoraSubscriptionState(
    DigitalSubscriptionState(
      Country.UK,
      product = DigitalPack(Currency.GBP, Monthly),
      paymentMethod = PayPalReferenceTransaction("baid", "me@somewhere.com"),
      appliedPromotion = None,
      salesForceContact = SalesforceContactRecord("sfbuy", "sfbuyacid"),
      similarProductsConsent = None,
    ),
    UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
    User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    DigitalPack(Currency.GBP, Monthly),
    AnalyticsInfo(false, StripeApplePay),
    None,
    None,
    csrUsername = None,
    salesforceCaseId = None,
    None,
  )

  val thankYouEmailProductTypeState: SendThankYouEmailState =
    ProductTypeCreatedTestData.digitalSubscriptionCreated

  val sendAcquisitionEventState: SendAcquisitionEventState = SendAcquisitionEventState(
    requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
    ProductTypeCreatedTestData.digitalSubscriptionCreated,
    analyticsInfo = AnalyticsInfo(false, PayPal),
    acquisitionData = None,
  )

  val preparePaymentMethodForReuseState = PreparePaymentMethodForReuseState(
    requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    giftRecipient = None,
    product = DigitalPack(Currency.GBP, Monthly),
    analyticsInfo = AnalyticsInfo(false, StripeApplePay),
    paymentFields = ExistingPaymentFields("existingBillingAcId"),
    acquisitionData = None,
    appliedPromotion = None,
  )
}
