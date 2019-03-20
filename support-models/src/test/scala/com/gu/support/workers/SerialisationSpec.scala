package com.gu.support.workers

import com.gu.i18n.Currency
import com.gu.support.SerialisationTestHelpers
import com.gu.support.workers.Fixtures._
import com.gu.support.workers.states._
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._
import org.scalatest.{Assertion, FlatSpec}
import io.circe.syntax._
import io.circe.parser._

class SerialisationSpec extends FlatSpec with SerialisationTestHelpers with LazyLogging {

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
  }

  "CreateSalesforceContactState" should "deserialise correctly" in {
    testDecoding[CreateSalesforceContactState](createSalesforceContactJson)
  }

  "CreateZuoraSubscription" should "deserialise correctly" in {
    testDecoding[CreateZuoraSubscriptionState](createContributionZuoraSubscriptionJson())
    testDecoding[CreateZuoraSubscriptionState](createContributionZuoraSubscriptionJson(Annual))
    testDecoding[CreateZuoraSubscriptionState](createDigiPackZuoraSubscriptionJson)
  }

  "SendThankYouEmailState" should "deserialise correctly" in {
    testDecoding[SendThankYouEmailState](thankYouEmailJson)
  }

  "EmailPaymentMethodFields" should "serialise correctly direct debit" in {



    shouldSerialiseTo(testDirectDebitFields, thankYouEmailDirectDebitPaymentMethodJson)
  }

  it should "serialise correctly card " in {
    shouldSerialiseTo(CreditCardDisplayFields, thankYouEmailCardPaymentMethodJson)
  }

  it should "serialise correctly Paypal " in {
    shouldSerialiseTo(PaypalDisplayFields, thankYouEmailPaypalPaymentMethodJson)
  }

  it should "deserialise direct debit correctly" in {
    shouldDeserialiseTo(thankYouEmailDirectDebitPaymentMethodJson, testDirectDebitFields)
  }

  it should "deserialise card correctly" in {
    shouldDeserialiseTo(thankYouEmailCardPaymentMethodJson, CreditCardDisplayFields)
  }

  it should "deserialise paypal correctly" in {
    shouldDeserialiseTo(thankYouEmailPaypalPaymentMethodJson, PaypalDisplayFields)
  }
  def shouldSerialiseTo(fields:PaymentMethodDisplayFields, expectedJson: String): Assertion = Right(fields.asJson) shouldBe parse(expectedJson)

  val testDirectDebitFields = DirectDebitDisplayFields(
    bankAccountName = "accountName",
    bankAccountNumberMask = "mask",
    bankSortCode = "12-23-32",
    mandateId = Some("someId")
  )

  def shouldDeserialiseTo(paymentFieldsJson:String, expected:PaymentMethodDisplayFields): Assertion = {
    val decoded = decode[PaymentMethodDisplayFields](paymentFieldsJson)
    decoded shouldBe Right(expected)
  }
}
