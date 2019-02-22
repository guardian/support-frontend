package utils

import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.{Country, Currency}
import com.gu.support.workers.{Annual, DigitalPack, Monthly, StripePaymentFields}
import org.scalatest.{FlatSpec, Matchers}
import services.stepfunctions.CreateSupportWorkersRequest

class SimpleValidatorTest extends FlatSpec with Matchers {

  val validDigitalPackRequest = CreateSupportWorkersRequest(
    firstName = "grace",
    lastName = "hopper",
    country = Country.US,
    state = Some("VA"),
    product = DigitalPack(Currency.USD, Monthly),
    firstDeliveryDate = None,
    paymentFields = StripePaymentFields("test-token"),
    ophanIds = OphanIds(None, None, None),
    referrerAcquisitionData = ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com",
    telephoneNumber = None,
    promoCode = None,
    addressLine1 = None,
    addressLine2 = None,
    townCity = None,
    county = None,
    postcode = None
  )

  "validate" should "return true when there are no empty strings" in {
    SimpleCheckoutFormValidation.passes(validDigitalPackRequest) shouldBe true
  }

  "validate" should "reject empty strings in the name field" in {
    val requestMissingFirstName = validDigitalPackRequest.copy(firstName = "")
    SimpleCheckoutFormValidation.passes(requestMissingFirstName) shouldBe false
  }

  "validate" should "fail if the country is US and there is no state selected" in {
    val requestMissingState = validDigitalPackRequest.copy(state = None)
    DigitalPackValidation.passes(requestMissingState) shouldBe false
  }

  "validate" should "also fail if the country is Canada and there is no state selected" in {
    val requestMissingState = validDigitalPackRequest.copy(country = Country.Canada, state = None)
    DigitalPackValidation.passes(requestMissingState) shouldBe false
  }

  "validate" should "pass if there is no state selected and the country is Australia" in {
    val requestMissingState = validDigitalPackRequest.copy(country = Country.Australia, product = DigitalPack(Currency.AUD, Monthly), state = None)
    DigitalPackValidation.passes(requestMissingState) shouldBe true
  }

  "validate" should "fail if the payment field received is an empty string" in {
    val requestMissingState = validDigitalPackRequest.copy(paymentFields = StripePaymentFields(""))
    DigitalPackValidation.passes(requestMissingState) shouldBe false
  }

  "validate" should "succeed for a standard country and currency combination" in {
    val requestMissingState = validDigitalPackRequest.copy(country = Country.UK, product = DigitalPack(Currency.GBP, Annual), state = None)
    DigitalPackValidation.passes(requestMissingState) shouldBe true
  }

  "validate" should "fail if the country and currency combination is unsupported" in {
    val requestMissingState = validDigitalPackRequest.copy(country = Country.US, product = DigitalPack(Currency.GBP, Annual), state = None)
    DigitalPackValidation.passes(requestMissingState) shouldBe false
  }

  "validate" should "fail if the telephone number is longer than 40 characters " in {
    val requestWithTooLongTelephoneNumber = validDigitalPackRequest.copy(telephoneNumber = Some("12345678901234567890123456789012345678901"))
    DigitalPackValidation.passes(requestWithTooLongTelephoneNumber) shouldBe false
  }

  "validate" should "not check what the characters are in a telephone number" in {
    val requestWithTooLongTelephoneNumber = validDigitalPackRequest.copy(telephoneNumber = Some("abcdef"))
    DigitalPackValidation.passes(requestWithTooLongTelephoneNumber) shouldBe true
  }

}
