package com.gu.support.workers

import java.util.UUID

import com.gu.i18n.{Country, Currency}
import com.gu.support.SerialisationTestHelpers
import com.gu.support.catalog.RestOfWorld
import com.gu.support.workers.Fixtures._
import com.gu.support.workers.states._
import com.typesafe.scalalogging.LazyLogging
import org.joda.time.LocalDate
import org.scalatest.EitherValues
import org.scalatest.flatspec.AsyncFlatSpec


class SerialisationSpec extends AsyncFlatSpec with SerialisationTestHelpers with LazyLogging with EitherValues {

  "Contribution JSON with a billing period set" should "be decoded correctly" in {
    val input = contribution(billingPeriod = Annual)
    testDecoding[Contribution](input, _.billingPeriod shouldBe Annual)
  }

  "CreatePaymentMethodState" should "deserialise correctly" in {
    testDecoding[CreatePaymentMethodState](createStripePaymentMethodContributionJson())
    testDecoding[CreatePaymentMethodState](createPayPalPaymentMethodContributionJson(Currency.USD))
    testDecoding[CreatePaymentMethodState](createPayPalPaymentMethodDigitalPackJson)
    testDecoding[CreatePaymentMethodState](createDirectDebitDigitalPackJson,
      _.acquisitionData.get.ophanIds.pageviewId shouldBe Some("jkcg440imu1c0m8pxpxe")
    )
    testDecoding[CreatePaymentMethodState](createDirectDebitGuardianWeeklyJson,
      state => state.product match {
        case g: GuardianWeekly => g.fulfilmentOptions shouldBe RestOfWorld
        case _ => fail()
      }
    )
  }

  "CreateSalesforceContactState" should "deserialise correctly" in {
    testDecoding[CreateSalesforceContactState](createSalesforceContactJson)
  }

  "CreateZuoraSubscription" should "deserialise correctly" in {
    testDecoding[CreateZuoraSubscriptionState](createContributionZuoraSubscriptionJson())
    testDecoding[CreateZuoraSubscriptionState](createContributionZuoraSubscriptionJson(Annual))
    testDecoding[CreateZuoraSubscriptionState](createDigiPackZuoraSubscriptionJson)
    testDecoding[CreateZuoraSubscriptionState](createCorporateDigiPackZuoraSubscriptionJson,
      state => state.paymentMethod.right.value.redemptionCode.value shouldBe "FAKECODE"
    )
  }

  "SendThankYouEmailState" should "deserialise correctly" in {
    testDecoding[SendThankYouEmailState](thankYouEmailJson())
  }

  it should "roundtrip successfully" in {

    val state = SendThankYouEmailState(
      requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
      giftRecipient = None,
      product = DigitalPack(Currency.GBP, Monthly),
      paymentOrRedemptionData = Left(PaymentMethodWithSchedule(
        PayPalReferenceTransaction("baid", "me@somewhere.com"),
        PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49)))
      )),
      firstDeliveryDate = None,
      promoCode = None,
      salesForceContact = SalesforceContactRecord("sfbuy", "sfbuyacid"),
      acquisitionData = None,
      accountNumber = "123ac",
      subscriptionNumber = "123sub"
    )

    testRoundTripSerialisation[SendThankYouEmailState](state)
  }

  "FailureHandlerState" should "deserialise correctly from any lambda" in {
    testDecoding[FailureHandlerState](createPayPalPaymentMethodDigitalPackJson,
      state => state.paymentFields.isDefined shouldBe true
    )
    testDecoding[FailureHandlerState](createContributionZuoraSubscriptionJson(Annual),
      state => state.paymentMethod.isDefined shouldBe true
    )
  }

}
