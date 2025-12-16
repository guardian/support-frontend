package utils

import admin.settings.{
  CampaignSwitches,
  FeatureSwitches,
  Off,
  On,
  OneOffPaymentMethodSwitches,
  RecaptchaSwitches,
  RecurringPaymentMethodSwitches,
  SubscriptionsPaymentMethodSwitches,
  SubscriptionsSwitches,
  Switches,
}
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, Currency}
import com.gu.support.acquisitions.{OphanIds, ReferrerAcquisitionData}
import com.gu.support.catalog.{Collection, Domestic, Everyday, HomeDelivery}
import com.gu.support.paperround.{AgentId, CoverageEndpoint, PaperRoundAPI}
import com.gu.support.paperround.CoverageEndpoint.{NC, CO, PostcodeCoverage}
import com.gu.support.workers.StripePaymentType.StripeCheckout
import com.gu.support.workers._
import com.gu.support.zuora.api.ReaderType.Direct
import org.joda.time.LocalDate
import org.scalatest.flatspec.{AnyFlatSpec, AsyncFlatSpec}
import org.scalatest.matchers.should.Matchers
import services.stepfunctions.CreateSupportWorkersRequest
import utils.CheckoutValidationRules.{Invalid, Valid}
import utils.TestData.{monthlyDirectUSDProduct, validSupporterPlusRequest}

import scala.concurrent.Future

class PaymentSwitchValidationTest extends AnyFlatSpec with Matchers {

  it should "return Invalid if a user tries to pay with direct debit but the Direct debit switch in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = DirectDebitPaymentFields("Testuser", "", "", ""),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(Off),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }

  it should "return Invalid if a user tries to pay with Apple Pay but the  Apple Pay switch in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = StripePaymentFields(
        paymentMethod = PaymentMethodId("testId").get,
        stripePaymentType = Some(StripePaymentType.StripeApplePay),
        stripePublicKey = StripePublicKey.get("pk_test_asdf"),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(Off),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(Off),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Invalid if a user tries to pay with Sepa but the Sepa switch in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = SepaPaymentFields("", "", Some(""), Some("")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(Off),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }

  it should "return Invalid if a user tries to pay with PayPal but the Pay Pal switch in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = PayPalPaymentFields(""),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(Off),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Invalid if a user tries to pay with Stripe but the switch in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = StripePaymentFields(
        PaymentMethodId("testStripeToken").get,
        stripePaymentType = None,
        stripePublicKey = StripePublicKey.get("pk_test_asdf"),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(Off),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Invalid if a user tries to pay with Stripe Payment Request Button but the switch in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = StripePaymentFields(
        paymentMethod = PaymentMethodId("testId").get,
        stripePaymentType = Some(StripePaymentType.StripePaymentRequestButton),
        stripePublicKey = StripePublicKey.get("pk_test_asdf"),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(Off),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Invalid if a user tries to pay with Stripe Checkout but the switch  in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = StripePaymentFields(
        paymentMethod = PaymentMethodId("testId").get,
        stripePaymentType = Some(StripePaymentType.StripeCheckout),
        stripePublicKey = StripePublicKey.get("pk_test_asdf"),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(Off),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Invalid if a user tries to pay with Pay Pal but the Pay Pal switch in RRCP is off for Subscription Payment " in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = DigitalPack(GBP, Monthly),
      paymentFields = PayPalPaymentFields(""),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(Off),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Invalid if a user tries to pay with Direct Debit but the Direct Debit switch in RRCP is off for Subscription Payment " in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = DigitalPack(
        GBP,
        Monthly,
      ),
      paymentFields = DirectDebitPaymentFields("", "", "", ""),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(Off),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }

  it should "return Invalid if a user tries to pay with Credit card(Stripe) but the  switch in RRCP is off for Subscription Payment " in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = DigitalPack(
        GBP,
        Monthly,
      ),
      paymentFields = StripePaymentFields(
        paymentMethod = PaymentMethodId("testId").get,
        stripePaymentType = Some(StripePaymentType.StripeCheckout),
        stripePublicKey = StripePublicKey.get("pk_test_asdf"),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(Off),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }

  // Below are the test case for 'ON' state of  payment switches
  it should "return Valid if a user tries to pay with direct debit while the Direct debit switch in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = DirectDebitPaymentFields("Testuser", "", "", ""),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Valid
  }

  it should "return Valid if a user tries to pay with Apple Pay while the  Apple Pay switch in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = StripePaymentFields(
        paymentMethod = PaymentMethodId("testId").get,
        stripePaymentType = Some(StripePaymentType.StripeApplePay),
        stripePublicKey = StripePublicKey.get("pk_test_asdf"),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Sepa while the Sepa switch in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = SepaPaymentFields("", "", Some(""), Some("")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Valid
  }

  it should "return Valid if a user tries to pay with PayPal while the Pay Pal switch in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = PayPalPaymentFields(""),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Stripe  while the switch  in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = StripePaymentFields(
        PaymentMethodId("testStripeToken").get,
        stripePaymentType = Some(StripeCheckout),
        stripePublicKey = StripePublicKey.get("pk_test_asdf"),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Stripe Payment Request Button while the switch  in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = StripePaymentFields(
        paymentMethod = PaymentMethodId("testId").get,
        stripePaymentType = Some(StripePaymentType.StripePaymentRequestButton),
        stripePublicKey = StripePublicKey.get("pk_test_asdf"),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Stripe Checkout while the switch  in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = StripePaymentFields(
        paymentMethod = PaymentMethodId("testId").get,
        stripePaymentType = Some(StripePaymentType.StripeCheckout),
        stripePublicKey = StripePublicKey.get("pk_test_asdf"),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Pay Pal while the Pay Pal switch in RRCP is on for Subscription Payment " in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = SupporterPlus(0, GBP, Monthly),
      paymentFields = PayPalPaymentFields(""),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Direct Debit while the Direct Debit switch in RRCP is on for Subscription Payment " in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = DigitalPack(
        GBP,
        Monthly,
      ),
      paymentFields = DirectDebitPaymentFields("", "", "", ""),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Valid
  }

  it should "return Valid if a user tries to pay with Credit card(Stripe) but while the  switch in RRCP is on for Subscription Payment " in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = DigitalPack(
        GBP,
        Monthly,
      ),
      paymentFields = StripePaymentFields(
        paymentMethod = PaymentMethodId("testId").get,
        stripePaymentType = Some(StripePaymentType.StripeCheckout),
        stripePublicKey = StripePublicKey.get("pk_test_asdf"),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(On),
          sepa = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
        SubscriptionsPaymentMethodSwitches(
          directDebit = Some(On),
          creditCard = Some(On),
          paypal = Some(On),
          stripeHostedCheckout = Some(Off),
        ),
      ),
    ) shouldBe Valid
  }

}
class SimpleCheckoutFormValidationTest extends AnyFlatSpec with Matchers {

  import TestData.validDigitalPackRequest

  "SimpleCheckoutFormValidation.passes" should "return true when there are no empty strings" in {
    SimpleCheckoutFormValidation.passes(validDigitalPackRequest) shouldBe Valid
  }

  it should "reject empty strings in the name field" in {
    val requestMissingFirstName = validDigitalPackRequest.copy(firstName = "")
    SimpleCheckoutFormValidation.passes(requestMissingFirstName) shouldBe an[Invalid]
  }

  it should "reject a first name which is too long" in {
    val requestWithLongFirstName = validDigitalPackRequest.copy(firstName = "TooLongToBeFirstNameAccordingToSalesforce")
    SimpleCheckoutFormValidation.passes(requestWithLongFirstName) shouldBe an[Invalid]
  }

  it should "reject a last name which is too long" in {
    val requestWithLongLastName =
      validDigitalPackRequest.copy(lastName =
        "TooLongToBeLastNameAccordingToSalesforceTooLongToBeLastNameAccordingToSalesforce1",
      )
    SimpleCheckoutFormValidation.passes(requestWithLongLastName) shouldBe an[Invalid]
  }

  it should "reject invalid characters in strings" in {
    SimpleCheckoutFormValidation.noFourByteUtf8Characters("test1", "hello😊") shouldBe an[Invalid];
    SimpleCheckoutFormValidation.noFourByteUtf8Characters("test2", "𐀀goodbye") shouldBe an[Invalid];
    SimpleCheckoutFormValidation.noFourByteUtf8Characters("test3", "wa𠀀it") shouldBe an[Invalid];
  }

  it should "not reject valid characters in strings" in {
    SimpleCheckoutFormValidation.noFourByteUtf8Characters("test1", "hello✅") shouldBe Valid;
    SimpleCheckoutFormValidation.noFourByteUtf8Characters("test2", "￿goodbye") shouldBe Valid;
    SimpleCheckoutFormValidation.noFourByteUtf8Characters("test3", "wa퟿it") shouldBe Valid;
    SimpleCheckoutFormValidation.noFourByteUtf8Characters("test4", "come  back!") shouldBe Valid;
  }

  it should "check fields for invalid characters" in {
    SimpleCheckoutFormValidation.noFieldsHaveUnsupportedCharacters(
      validDigitalPackRequest.copy(deliveryInstructions = Some("😊")),
    ) shouldBe an[Invalid]
  }
}

class PaidProductValidationTest extends AnyFlatSpec with Matchers {
  import TestData.validDigitalPackRequest

  "PaidProductValidation.passes" should " fail if the country is United States and there is no state" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.US, state = None),
      product = SupporterPlus(50, Currency.USD, Annual),
    )
    PaidProductValidation.passes(requestMissingState) shouldBe an[Invalid]
  }

  it should " fail if the country is United States and there is no state for Contribution product" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.US, state = None),
      product = SupporterPlus(5, Currency.USD, Annual),
    )
    PaidProductValidation.passes(requestMissingState) shouldBe an[Invalid]
  }

  it should " fail if the country is United States and there is empty string in state for Contribution product" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.US, state = Some("")),
      product = SupporterPlus(5, Currency.USD, Annual),
    )
    PaidProductValidation.passes(requestMissingState) shouldBe an[Invalid]
  }

  it should "succeed  if the country is UK and there is no state" in {
    val requestSupporterPlus = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.UK, state = None),
      product = SupporterPlus(50, Currency.GBP, Annual),
    )
    PaidProductValidation.passes(requestSupporterPlus) shouldBe Valid
  }

  it should "fail if the billing postcode field contains an email address" in {
    val requestEmailInBillingPostcodeField = validSupporterPlusRequest.copy(
      billingAddress = validSupporterPlusRequest.billingAddress.copy(postCode = Some("test@example.com")),
      product = SupporterPlus(5, Currency.USD, Annual),
    )
    PaidProductValidation.passes(requestEmailInBillingPostcodeField) shouldBe an[Invalid]
  }
}
class DigitalPackValidationTest extends AnyFlatSpec with Matchers {

  import TestData.validDigitalPackRequest

  "DigitalPackValidation.passes" should "fail if the country is US and there is no state selected" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.US, state = None),
    )
    DigitalPackValidation.passes(requestMissingState, monthlyDirectUSDProduct) shouldBe an[Invalid]
  }

  it should "also fail if the country is Canada and there is no state selected" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.Canada, state = None),
    )
    DigitalPackValidation.passes(requestMissingState, monthlyDirectUSDProduct) shouldBe an[Invalid]
  }

  it should "also fail if the country is Australia and there is no state selected" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.Australia, state = None),
      product = DigitalPack(Currency.AUD, Monthly),
    )
    DigitalPackValidation.passes(requestMissingState, monthlyDirectUSDProduct) shouldBe an[Invalid]
  }

  // Tests removed to facilitate purchase of digi subs via the S+ checkout for migrating Kindle customers
  // it should "also fail if the country is Australia and there is no postcode" in {
  //   val requestMissingPostcode = validDigitalPackRequest.copy(
  //     billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.Australia, postCode = None),
  //     product = DigitalPack(Currency.AUD, Monthly),
  //   )
  //   DigitalPackValidation.passes(requestMissingPostcode, monthlyDirectUSDProduct) shouldBe an[Invalid]
  // }

  // it should "also fail if the country is United Kingdom and there is no postcode" in {
  //   val requestMissingPostcode = validDigitalPackRequest.copy(
  //     billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.UK, postCode = None),
  //     product = DigitalPack(Currency.GBP, Monthly),
  //   )
  //   DigitalPackValidation.passes(requestMissingPostcode, monthlyDirectUSDProduct) shouldBe an[Invalid]
  // }

  // it should "also fail if the country is United States and there is no postcode" in {
  //   val requestMissingPostcode = validDigitalPackRequest.copy(
  //     billingAddress = validDigitalPackRequest.billingAddress.copy(postCode = None),
  //     product = DigitalPack(Currency.USD, Monthly),
  //   )
  //   DigitalPackValidation.passes(requestMissingPostcode, monthlyDirectUSDProduct) shouldBe an[Invalid]
  // }

  // it should "also fail if the country is Canada and there is no postcode" in {
  //   val requestMissingPostcode = validDigitalPackRequest.copy(
  //     billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.Canada, postCode = None),
  //     product = DigitalPack(Currency.CAD, Monthly),
  //   )
  //   DigitalPackValidation.passes(requestMissingPostcode, monthlyDirectUSDProduct) shouldBe an[Invalid]
  // }

  it should "also allow a missing postcode in other countries" in {
    val requestMissingPostcode = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.Ireland, postCode = None),
      product = DigitalPack(Currency.EUR, Monthly),
    )
    DigitalPackValidation.passes(requestMissingPostcode, monthlyDirectUSDProduct) shouldBe Valid
  }

  it should "fail if the source payment field received is an empty string" in {
    val requestMissingState = PaymentMethodId("")
    requestMissingState shouldBe None
  }

  it should "succeed for a standard country and currency combination" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.UK, state = None),
      product = DigitalPack(Currency.GBP, Annual),
    )
    DigitalPackValidation.passes(requestMissingState, monthlyDirectUSDProduct) shouldBe Valid
  }

  it should "fail if the country and currency combination is unsupported" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.US, state = Some("VA")),
      product = DigitalPack(Currency.GBP, Annual),
    )
    DigitalPackValidation.passes(requestMissingState, monthlyDirectUSDProduct) shouldBe an[Invalid]
  }

  // it should "fail when missing an address line or a city for billing address" in {
  //   val badBillingAddress = Address(
  //     lineOne = None,
  //     lineTwo = None,
  //     city = None,
  //     state = None,
  //     postCode = None,
  //     country = Country.UK,
  //   )
  //   val requestMissingAddressLineAndCity = validDigitalPackRequest.copy(billingAddress = badBillingAddress)
  //   DigitalPackValidation.passes(requestMissingAddressLineAndCity, monthlyDirectUSDProduct) shouldBe an[Invalid]
  // }

  // it should "fail if there are more than 20 characters in Billing Address postCode" in {
  //   val requestDigiSubPostCode = validDigitalPackRequest.copy(
  //     billingAddress = validDigitalPackRequest.billingAddress
  //       .copy(country = Country.UK, postCode = Some("Testcase11111111111111111111")),
  //     product = DigitalPack(Currency.GBP, Annual),
  //   )
  //   DigitalPackValidation.passes(requestDigiSubPostCode, monthlyDirectUSDProduct) shouldBe an[Invalid]
  // }

}

class PaperValidationTest extends AsyncFlatSpec with Matchers {

  import TestData.validPaperRequest

  case class TestPaperRound(agentMap: Map[String, List[BigInt]]) extends PaperRoundAPI {
    def toResponse(coverage: PostcodeCoverage) = CoverageEndpoint.Response(200, coverage)
    def toAgentsCoverage(agentId: AgentId) = CoverageEndpoint.AgentsCoverage(agentId, "", "", 0, "", AgentId(0), "")
    def coverage(body: CoverageEndpoint.RequestBody): Future[CoverageEndpoint.Response] =
      Future {
        agentMap
          .get(body.postcode)
          .fold(
            toResponse(PostcodeCoverage(List(), "", NC)),
          )(xs => toResponse(PostcodeCoverage(xs.map(x => toAgentsCoverage(AgentId(x))), "", CO)))
      }
    def agents() = Future.failed(new NotImplementedError("Not used"))
    def chargebands() = Future.failed(new NotImplementedError("Not used"))
  }

  "PaperValidation.passes" should "fail if the delivery country is US" in {
    val requestDeliveredToUs =
      validPaperRequest.copy(deliveryAddress = validPaperRequest.deliveryAddress map (_.copy(country = Country.US)))
    PaperValidation.passes(requestDeliveredToUs, Collection) shouldBe an[Invalid]
  }

  it should "fail if the currency is USD" in {
    val requestDeliveredToUs =
      validPaperRequest.copy(product = Paper(Currency.USD, Monthly, HomeDelivery, Everyday, None))
    PaperValidation.passes(requestDeliveredToUs, Collection) shouldBe an[Invalid]
  }

  it should "succeed HD if the country is UK and the currency is GBP" in {
    val requestDeliveredToUs = validPaperRequest
    PaperValidation.passes(requestDeliveredToUs, HomeDelivery) shouldBe Valid
  }

  it should "fail HD if outside the M25" in {
    val requestDeliveredToUs =
      validPaperRequest.copy(deliveryAddress =
        validPaperRequest.deliveryAddress.map(_.copy(postCode = Some("TS1 1AA"))),
      )
    PaperValidation.passes(requestDeliveredToUs, HomeDelivery) shouldBe an[Invalid]
  }

  it should "succeed Collection if the country is UK and the currency is GBP" in {
    val requestDeliveredToUs = validPaperRequest
    PaperValidation.passes(requestDeliveredToUs, Collection) shouldBe Valid
  }

  it should "fail if there is no first delivery date" in {
    val requestDeliveredToUs = validPaperRequest.copy(firstDeliveryDate = None)
    PaperValidation.passes(requestDeliveredToUs, Collection) shouldBe an[Invalid]
  }

  it should "fail when missing an address data for billing address" in {
    val emptyAddress = Address(
      lineOne = None,
      lineTwo = None,
      city = None,
      state = None,
      postCode = None,
      country = Country.UK,
    )
    val requestMissingAddressLineAndCity = validPaperRequest.copy(billingAddress = emptyAddress)
    PaperValidation.passes(requestMissingAddressLineAndCity, Collection) shouldBe an[Invalid]
  }

  it should "fail when missing an address data for delivery address" in {
    val emptyAddress = Address(
      lineOne = None,
      lineTwo = None,
      city = None,
      state = None,
      postCode = None,
      country = Country.UK,
    )
    val requestMissingAddressLineAndCity = validPaperRequest.copy(deliveryAddress = Some(emptyAddress))
    PaperValidation.passes(requestMissingAddressLineAndCity, Collection) shouldBe an[Invalid]
  }

  it should "fail if there are more than 20 characters in Billing Address postCode" in {
    val requestPostCode = validPaperRequest.copy(billingAddress =
      validPaperRequest.billingAddress.copy(postCode = Some("Test111111111111111111111111")),
    )
    PaperValidation.passes(requestPostCode, Collection) shouldBe an[Invalid]
  }
  it should "fail if there are more than 20 characters in Delivery Address postCode" in {
    val requestDeliveryPostCode = validPaperRequest.copy(deliveryAddress =
      validPaperRequest.deliveryAddress map (_.copy(postCode = Some("Test22222222222222222222"))),
    )
    PaperValidation.passes(requestDeliveryPostCode, Collection) shouldBe an[Invalid]
  }

  "PaperValidation.deliveryAgentChosenWhichCoversPostcode" should "fail if the user has chosen a delivery agent that PaperRound doesn’t return for their postcode" in {
    PaperValidation
      .deliveryAgentChosenWhichCoversPostcode(
        TestPaperRound(Map("DE10FD" -> List(2, 3))),
        Some(AgentId(1)),
        "DE10FD",
      )
      .map(r => r shouldBe an[Invalid])
  }

  it should "succeed if the user has chosen a delivery agent that PaperRound does return for their postcode" in {
    PaperValidation
      .deliveryAgentChosenWhichCoversPostcode(
        TestPaperRound(Map("DE10HN" -> List(1, 2))),
        Some(AgentId(1)),
        "DE10HN",
      )
      .map(r => r shouldBe Valid)
  }

  it should "fail if PaperRound doesn’t return any delivery agents for their postcode" in {
    PaperValidation
      .deliveryAgentChosenWhichCoversPostcode(
        TestPaperRound(Map("DE10HN" -> List(1, 2))),
        Some(AgentId(1)),
        "DE10FD",
      )
      .map(r => r shouldBe an[Invalid])
  }

  it should "fail if the user hasn’t chosen an agent" in {
    PaperValidation
      .deliveryAgentChosenWhichCoversPostcode(
        TestPaperRound(Map("DE10HN" -> List(1, 2))),
        None,
        "DE10FD",
      )
      .map(r => r shouldBe an[Invalid])
  }
}

class GuardianWeeklyValidationTest extends AnyFlatSpec with Matchers {

  import TestData.validWeeklyRequest

  it should "succeed if the delivery country is US" in {
    val requestDeliveredToUs =
      validWeeklyRequest.copy(deliveryAddress = validWeeklyRequest.deliveryAddress map (_.copy(country = Country.US)))
    GuardianWeeklyValidation.passes(requestDeliveredToUs) shouldBe Valid
  }

  it should "succeed if the currency is USD" in {
    val requestDeliveredToUs =
      validWeeklyRequest.copy(product = GuardianWeekly(Currency.USD, Monthly, HomeDelivery))
    GuardianWeeklyValidation.passes(requestDeliveredToUs) shouldBe Valid
  }

  it should "succeed if the country is UK and the currency is GBP" in {
    val requestDeliveredToUs = validWeeklyRequest
    GuardianWeeklyValidation.passes(requestDeliveredToUs) shouldBe Valid
  }

  it should "fail if there is no first delivery date" in {
    val requestDeliveredToUs = validWeeklyRequest.copy(firstDeliveryDate = None)
    GuardianWeeklyValidation.passes(requestDeliveredToUs) shouldBe an[Invalid]
  }
  it should "fail if there are more than 20 characters in Billing Address postCode" in {
    val requestPostCode = validWeeklyRequest.copy(billingAddress =
      validWeeklyRequest.billingAddress.copy(postCode = Some("Test111111111111111111111111")),
    )
    GuardianWeeklyValidation.passes(requestPostCode) shouldBe an[Invalid]
  }
  it should "fail if there are more than 20 characters in Delivery Address postCode" in {
    val requestDeliveryPostCode = validWeeklyRequest.copy(deliveryAddress =
      validWeeklyRequest.deliveryAddress map (_.copy(postCode = Some("Test22222222222222222222"))),
    )
    GuardianWeeklyValidation.passes(requestDeliveryPostCode) shouldBe an[Invalid]
  }

  it should "fail when missing an address data for billing address" in {
    val emptyAddress = Address(
      lineOne = None,
      lineTwo = None,
      city = None,
      state = None,
      postCode = None,
      country = Country.UK,
    )
    val requestMissingAddressLineAndCity = validWeeklyRequest.copy(billingAddress = emptyAddress)
    GuardianWeeklyValidation.passes(requestMissingAddressLineAndCity) shouldBe an[Invalid]
  }

  it should "fail when missing an address data for delivery address" in {
    val emptyAddress = Address(
      lineOne = None,
      lineTwo = None,
      city = None,
      state = None,
      postCode = None,
      country = Country.UK,
    )
    val requestMissingAddressLineAndCity = validWeeklyRequest.copy(deliveryAddress = Some(emptyAddress))
    GuardianWeeklyValidation.passes(requestMissingAddressLineAndCity) shouldBe an[Invalid]
  }
}

object TestData {
  def buildSwitches(
      recurringPaymentMethodSwitches: RecurringPaymentMethodSwitches = RecurringPaymentMethodSwitches(
        stripe = Some(On),
        stripeApplePay = Some(On),
        stripePaymentRequestButton = Some(On),
        stripeExpressCheckout = Some(On),
        payPal = Some(On),
        directDebit = Some(On),
        sepa = Some(On),
        stripeHostedCheckout = Some(Off),
      ),
      subscriptionsPaymentMethodSwitches: SubscriptionsPaymentMethodSwitches = SubscriptionsPaymentMethodSwitches(
        directDebit = Some(On),
        creditCard = Some(On),
        paypal = Some(On),
        stripeHostedCheckout = Some(Off),
      ),
  ): Switches = Switches(
    OneOffPaymentMethodSwitches(Some(On), Some(On), Some(On)),
    recurringPaymentMethodSwitches,
    subscriptionsPaymentMethodSwitches,
    SubscriptionsSwitches(Some(On), Some(On), Some(On)),
    FeatureSwitches(Some(On), Some(On), Some(On), Some(On), Some(On), Some(On), Some(On)),
    CampaignSwitches(Some(On), Some(On)),
    RecaptchaSwitches(Some(On), Some(On)),
  )

  val monthlyDirectUSDProduct = DigitalPack(Currency.USD, Monthly)
  private val stripePaymentFields: StripePaymentFields = StripePaymentFields(
    paymentMethod = PaymentMethodId("test_token").get,
    stripePaymentType = Some(StripePaymentType.StripeCheckout),
    stripePublicKey = StripePublicKey.get("pk_test_asdf"),
  )
  val validDigitalPackRequest = CreateSupportWorkersRequest(
    title = None,
    firstName = "grace",
    lastName = "hopper",
    product = monthlyDirectUSDProduct,
    productInformation = None,
    firstDeliveryDate = None,
    paymentFields = stripePaymentFields,
    ophanIds = OphanIds(None, None),
    referrerAcquisitionData =
      ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com",
    telephoneNumber = None,
    appliedPromotion = None,
    csrUsername = None,
    salesforceCaseId = None,
    billingAddress = Address(
      Some("123 easy street"),
      None,
      Some("arlington"),
      state = Some("VA"),
      postCode = Some("111111"),
      country = Country.US,
    ),
    deliveryAddress = None,
    giftRecipient = None,
    deliveryInstructions = None,
    debugInfo = None,
    similarProductsConsent = None,
  )
  val validSupporterPlusRequest = validDigitalPackRequest.copy(
    product = SupporterPlus(50, Currency.USD, Monthly),
  )

  val someDateNextMonth = new LocalDate().plusMonths(1)
  val paperAddress = Address(
    lineOne = Some("Address Line 1"),
    lineTwo = Some("Address Line 2"),
    city = Some("Address Town"),
    state = None,
    postCode = Some("N1 9AG"),
    country = Country.UK,
  )
  val validPaperRequest = CreateSupportWorkersRequest(
    title = None,
    firstName = "grace",
    lastName = "hopper",
    product = Paper(Currency.GBP, Monthly, HomeDelivery, Everyday, Some(AgentId(134789))),
    productInformation = None,
    firstDeliveryDate = Some(someDateNextMonth),
    paymentFields = stripePaymentFields,
    ophanIds = OphanIds(None, None),
    referrerAcquisitionData =
      ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com",
    telephoneNumber = None,
    appliedPromotion = None,
    csrUsername = None,
    salesforceCaseId = None,
    billingAddress = paperAddress,
    deliveryAddress = Some(paperAddress),
    giftRecipient = None,
    deliveryInstructions = None,
    debugInfo = None,
    similarProductsConsent = None,
  )

  val validWeeklyRequest = CreateSupportWorkersRequest(
    title = None,
    firstName = "grace",
    lastName = "hopper",
    product = GuardianWeekly(Currency.GBP, Monthly, Domestic),
    productInformation = None,
    firstDeliveryDate = Some(someDateNextMonth),
    paymentFields = stripePaymentFields,
    ophanIds = OphanIds(None, None),
    referrerAcquisitionData =
      ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com",
    telephoneNumber = None,
    appliedPromotion = None,
    csrUsername = None,
    salesforceCaseId = None,
    billingAddress = paperAddress,
    deliveryAddress = Some(paperAddress),
    giftRecipient = None,
    deliveryInstructions = None,
    debugInfo = None,
    similarProductsConsent = None,
  )

}
