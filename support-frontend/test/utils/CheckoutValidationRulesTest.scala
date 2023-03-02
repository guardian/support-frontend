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
  SwitchState,
  Switches,
}
import com.gu.i18n.Currency.{GBP, USD}
import com.gu.i18n.{Country, Currency}
import com.gu.support.acquisitions.{OphanIds, ReferrerAcquisitionData}
import com.gu.support.catalog.{Collection, Domestic, Everyday, HomeDelivery}
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers._
import com.gu.support.zuora.api.ReaderType.{Corporate, Direct, Gift}
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import services.stepfunctions.CreateSupportWorkersRequest
import services.stepfunctions.CreateSupportWorkersRequest.GiftRecipientRequest
import utils.CheckoutValidationRules.{Invalid, Valid}
import utils.TestData.monthlyDirectUSDProduct

class PaymentSwitchValidationTest extends AnyFlatSpec with Matchers {

  it should "return Invalid if a user tries to pay with direct debit but the Direct debit switch in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(DirectDebitPaymentFields("Testuser", "", "", "")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, Off, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }

  it should "return Invalid if a user tries to pay with Apple Pay but the  Apple Pay switch in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(
        StripePaymentMethodPaymentFields(
          paymentMethod = PaymentMethodId("testId").get,
          stripePaymentType = Some(StripePaymentType.StripeApplePay),
        ),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, Off, On, On, Off, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Invalid if a user tries to pay with Sepa but the Sepa switch in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(SepaPaymentFields("", "", Some(""), Some(""))),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, Off),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }

  it should "return Invalid if a user tries to pay with PayPal but the Pay Pal switch in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(PayPalPaymentFields("")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, Off, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Invalid if a user tries to pay with Stripe  but the switch  in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(
        StripeSourcePaymentFields("testStripeToken", stripePaymentType = None),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(Off, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Invalid if a user tries to pay with Stripe Payment Request Button but the switch  in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(
        StripePaymentMethodPaymentFields(
          paymentMethod = PaymentMethodId("testId").get,
          stripePaymentType = Some(StripePaymentType.StripePaymentRequestButton),
        ),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, Off, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Invalid if a user tries to pay with Stripe Checkout but the switch  in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(
        StripePaymentMethodPaymentFields(
          paymentMethod = PaymentMethodId("testId").get,
          stripePaymentType = Some(StripePaymentType.StripeCheckout),
        ),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(Off, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Invalid if a user tries to pay with Amazon Pay but the Amazon Pay switch in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(AmazonPayPaymentFields("")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, Off, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Valid if a user tries to pay with Existing Direct Debit or Card while the switch in RRCP is off" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(ExistingPaymentFields("")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, Off, Off, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Valid
  }
  it should "return Invalid if a user tries to pay with Pay Pal but the Pay Pal switch in RRCP is off for Subscription Payment " in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = DigitalPack(GBP, Monthly),
      paymentFields = Left(PayPalPaymentFields("")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, Off),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }
  it should "return Invalid if a user tries to pay with Direct Debit but the Direct Debit switch in RRCP is off for Subscription Payment " in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = DigitalPack(
        GBP,
        Monthly,
        Direct,
        Some(0),
      ),
      paymentFields = Left(DirectDebitPaymentFields("", "", "", "")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(Off, On, On),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }

  it should "return Invalid if a user tries to pay with Credit card(Stripe) but the  switch in RRCP is off for Subscription Payment " in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = DigitalPack(
        GBP,
        Monthly,
        Direct,
        Some(0),
      ),
      paymentFields = Left(
        StripePaymentMethodPaymentFields(
          paymentMethod = PaymentMethodId("testId").get,
          stripePaymentType = Some(StripePaymentType.StripeCheckout),
        ),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, Off, On),
      ),
    ) shouldBe Invalid("Invalid Payment Method")
  }

  // Below are the test case for 'ON' state of  payment switches
  it should "return Valid if a user tries to pay with direct debit while the Direct debit switch in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(DirectDebitPaymentFields("Testuser", "", "", "")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Valid
  }

  it should "return Valid if a user tries to pay with Apple Pay while the  Apple Pay switch in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(
        StripePaymentMethodPaymentFields(
          paymentMethod = PaymentMethodId("testId").get,
          stripePaymentType = Some(StripePaymentType.StripeApplePay),
        ),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Sepa while the Sepa switch in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(SepaPaymentFields("", "", Some(""), Some(""))),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Valid
  }

  it should "return Valid if a user tries to pay with PayPal while the Pay Pal switch in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(PayPalPaymentFields("")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Stripe  while the switch  in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(
        StripeSourcePaymentFields("testStripeToken", stripePaymentType = None),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Stripe Payment Request Button while the switch  in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(
        StripePaymentMethodPaymentFields(
          paymentMethod = PaymentMethodId("testId").get,
          stripePaymentType = Some(StripePaymentType.StripePaymentRequestButton),
        ),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Stripe Checkout while the switch  in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(
        StripePaymentMethodPaymentFields(
          paymentMethod = PaymentMethodId("testId").get,
          stripePaymentType = Some(StripePaymentType.StripeCheckout),
        ),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Amazon Pay while the Amazon Pay switch in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(AmazonPayPaymentFields("")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Existing Direct Debit or Card while the switch in RRCP is on" in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = Contribution(0, GBP, Monthly),
      paymentFields = Left(ExistingPaymentFields("")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Pay Pal while the Pay Pal switch in RRCP is on for Subscription Payment " in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = SupporterPlus(0, GBP, Monthly),
      paymentFields = Left(PayPalPaymentFields("")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Valid
  }
  it should "return Valid if a user tries to pay with Direct Debit while the Direct Debit switch in RRCP is on for Subscription Payment " in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = DigitalPack(
        GBP,
        Monthly,
        Direct,
        Some(0),
      ),
      paymentFields = Left(DirectDebitPaymentFields("", "", "", "")),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
      ),
    ) shouldBe Valid
  }

  it should "return Valid if a user tries to pay with Credit card(Stripe) but while the  switch in RRCP is on for Subscription Payment " in {
    CheckoutValidationRules.checkPaymentMethodEnabled(
      product = DigitalPack(
        GBP,
        Monthly,
        Direct,
        Some(0),
      ),
      paymentFields = Left(
        StripePaymentMethodPaymentFields(
          paymentMethod = PaymentMethodId("testId").get,
          stripePaymentType = Some(StripePaymentType.StripeCheckout),
        ),
      ),
      switches = TestData.buildSwitches(
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
        SubscriptionsPaymentMethodSwitches(On, On, On),
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
    val requestMissingState = validDigitalPackRequest.copy(paymentFields = Left(StripeSourcePaymentFields("", None)))
    DigitalPackValidation.passes(requestMissingState, monthlyDirectUSDProduct) shouldBe an[Invalid]
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

  it should "succeed when there is a valid corporate sub" in {
    val product = DigitalPack(GBP, Monthly, Corporate)
    val corporateSub = validDigitalPackRequest.copy(
      product = product,
      paymentFields = Right(RedemptionData(RedemptionCode("test-code-123").toOption.get)),
    )

    DigitalPackValidation.passes(corporateSub, product) shouldBe Valid
  }

  // it should "fail if there are more than 20 characters in Billing Address postCode" in {
  //   val requestDigiSubPostCode = validDigitalPackRequest.copy(
  //     billingAddress = validDigitalPackRequest.billingAddress
  //       .copy(country = Country.UK, postCode = Some("Testcase11111111111111111111")),
  //     product = DigitalPack(Currency.GBP, Annual),
  //   )
  //   DigitalPackValidation.passes(requestDigiSubPostCode, monthlyDirectUSDProduct) shouldBe an[Invalid]
  // }

  it should "succeed when there is a valid gift sub purchase" in {
    val product = DigitalPack(USD, Monthly, Gift)
    val giftPurchase = validDigitalPackRequest.copy(
      product = product,
      giftRecipient = Some(
        GiftRecipientRequest(
          None,
          "bob",
          "builder",
          Some("bob@thegulocal.com"),
          Some("have a nice sub"),
          Some(new LocalDate(2020, 10, 2)),
        ),
      ),
    )

    DigitalPackValidation.passes(giftPurchase, product) shouldBe Valid
  }

  it should "succeed when there is a valid gift sub redemption" in {
    val product = DigitalPack(GBP, Monthly, Gift)
    val giftRedemption = validDigitalPackRequest.copy(
      product = product,
      paymentFields = Right(RedemptionData(RedemptionCode("test-code-123").toOption.get)),
    )

    DigitalPackValidation.passes(giftRedemption, product) shouldBe Valid
  }

}

class PaperValidationTest extends AnyFlatSpec with Matchers {

  import TestData.validPaperRequest

  "PaperValidation.passes" should "fail if the delivery country is US" in {
    val requestDeliveredToUs =
      validPaperRequest.copy(deliveryAddress = validPaperRequest.deliveryAddress map (_.copy(country = Country.US)))
    PaperValidation.passes(requestDeliveredToUs, Collection) shouldBe an[Invalid]
  }

  it should "fail if the currency is USD" in {
    val requestDeliveredToUs = validPaperRequest.copy(product = Paper(Currency.USD, Monthly, HomeDelivery, Everyday))
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

  it should "not allow corporate redemptions for paper products" in {
    val requestWithCorporateRedemption =
      validPaperRequest.copy(paymentFields = Right(RedemptionData(RedemptionCode("test-code-123").toOption.get)))
    PaperValidation.passes(requestWithCorporateRedemption, Collection) shouldBe an[Invalid]
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

}

class GuardianWeeklyValidationTest extends AnyFlatSpec with Matchers {

  import TestData.validWeeklyRequest

  it should "succeed if the delivery country is US" in {
    val requestDeliveredToUs =
      validWeeklyRequest.copy(deliveryAddress = validWeeklyRequest.deliveryAddress map (_.copy(country = Country.US)))
    GuardianWeeklyValidation.passes(requestDeliveredToUs) shouldBe Valid
  }

  it should "succeed if the currency is USD" in {
    val requestDeliveredToUs = validWeeklyRequest.copy(product = Paper(Currency.USD, Monthly, HomeDelivery, Everyday))
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

  it should "not allow corporate redemptions for paper products" in {
    val requestWithCorporateRedemption =
      validWeeklyRequest.copy(paymentFields = Right(RedemptionData(RedemptionCode("test-code-123").toOption.get)))
    GuardianWeeklyValidation.passes(requestWithCorporateRedemption) shouldBe an[Invalid]
  }

}

object TestData {
  def buildSwitches(
      recurringPaymentMethodSwitches: RecurringPaymentMethodSwitches =
        RecurringPaymentMethodSwitches(On, On, On, On, On, On, On, On, On),
      subscriptionsPaymentMethodSwitches: SubscriptionsPaymentMethodSwitches =
        SubscriptionsPaymentMethodSwitches(On, On, On),
  ): Switches = Switches(
    OneOffPaymentMethodSwitches(On, On, On, On, On),
    recurringPaymentMethodSwitches,
    subscriptionsPaymentMethodSwitches,
    SubscriptionsSwitches(On, On, On),
    FeatureSwitches(On, On),
    CampaignSwitches(On, On),
    RecaptchaSwitches(On, On),
  )

  val monthlyDirectUSDProduct = DigitalPack(Currency.USD, Monthly)
  val validDigitalPackRequest = CreateSupportWorkersRequest(
    title = None,
    firstName = "grace",
    lastName = "hopper",
    product = monthlyDirectUSDProduct,
    firstDeliveryDate = None,
    paymentFields =
      Left(StripePaymentMethodPaymentFields(PaymentMethodId("test_token").get, Some(StripePaymentType.StripeCheckout))),
    ophanIds = OphanIds(None, None, None),
    referrerAcquisitionData =
      ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com",
    telephoneNumber = None,
    promoCode = None,
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
    product = Paper(Currency.GBP, Monthly, HomeDelivery, Everyday),
    firstDeliveryDate = Some(someDateNextMonth),
    paymentFields =
      Left(StripePaymentMethodPaymentFields(PaymentMethodId("test_token").get, Some(StripePaymentType.StripeCheckout))),
    ophanIds = OphanIds(None, None, None),
    referrerAcquisitionData =
      ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com",
    telephoneNumber = None,
    promoCode = None,
    csrUsername = None,
    salesforceCaseId = None,
    billingAddress = paperAddress,
    deliveryAddress = Some(paperAddress),
    giftRecipient = None,
    deliveryInstructions = None,
    debugInfo = None,
  )

  val validWeeklyRequest = CreateSupportWorkersRequest(
    title = None,
    firstName = "grace",
    lastName = "hopper",
    product = GuardianWeekly(Currency.GBP, Monthly, Domestic),
    firstDeliveryDate = Some(someDateNextMonth),
    paymentFields =
      Left(StripePaymentMethodPaymentFields(PaymentMethodId("test_token").get, Some(StripePaymentType.StripeCheckout))),
    ophanIds = OphanIds(None, None, None),
    referrerAcquisitionData =
      ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com",
    telephoneNumber = None,
    promoCode = None,
    csrUsername = None,
    salesforceCaseId = None,
    billingAddress = paperAddress,
    deliveryAddress = Some(paperAddress),
    giftRecipient = None,
    deliveryInstructions = None,
    debugInfo = None,
  )

}
