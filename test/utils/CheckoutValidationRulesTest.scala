package utils

import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.{Country, Currency}
import com.gu.support.catalog.{Everyday, HomeDelivery}
import com.gu.support.workers._
import org.scalatest.{FlatSpec, Matchers}
import services.stepfunctions.CreateSupportWorkersRequest

class SimpleCheckoutFormValidationTest extends FlatSpec with Matchers {

  import TestData.validDigitalPackRequest

  "SimpleCheckoutFormValidation.passes" should "return true when there are no empty strings" in {
    SimpleCheckoutFormValidation.passes(validDigitalPackRequest) shouldBe true
  }

  "SimpleCheckoutFormValidation.passes" should "reject empty strings in the name field" in {
    val requestMissingFirstName = validDigitalPackRequest.copy(firstName = "")
    SimpleCheckoutFormValidation.passes(requestMissingFirstName) shouldBe false
  }

  "SimpleCheckoutFormValidation.passes" should "fail if the telephone number is longer than 40 characters " in {
    val requestWithTooLongTelephoneNumber = validDigitalPackRequest.copy(telephoneNumber = Some("12345678901234567890123456789012345678901"))
    SimpleCheckoutFormValidation.passes(requestWithTooLongTelephoneNumber) shouldBe false
  }

  "SimpleCheckoutFormValidation.passes" should "not check what the characters are in a telephone number" in {
    val requestWithTooLongTelephoneNumber = validDigitalPackRequest.copy(telephoneNumber = Some("abcdef"))
    SimpleCheckoutFormValidation.passes(requestWithTooLongTelephoneNumber) shouldBe true
  }

}

class DigitalPackValidationTest extends FlatSpec with Matchers {

  import TestData.validDigitalPackRequest

  "DigitalPackValidation.passes" should "fail if the country is US and there is no state selected" in {
    val requestMissingState = validDigitalPackRequest.copy(state = None)
    DigitalPackValidation.passes(requestMissingState) shouldBe false
  }

  "DigitalPackValidation.passes" should "also fail if the country is Canada and there is no state selected" in {
    val requestMissingState = validDigitalPackRequest.copy(country = Country.Canada, state = None)
    DigitalPackValidation.passes(requestMissingState) shouldBe false
  }

  "DigitalPackValidation.passes" should "pass if there is no state selected and the country is Australia" in {
    val requestMissingState = validDigitalPackRequest.copy(country = Country.Australia, product = DigitalPack(Currency.AUD, Monthly), state = None)
    DigitalPackValidation.passes(requestMissingState) shouldBe true
  }

  "DigitalPackValidation.passes" should "fail if the payment field received is an empty string" in {
    val requestMissingState = validDigitalPackRequest.copy(paymentFields = StripePaymentFields(""))
    DigitalPackValidation.passes(requestMissingState) shouldBe false
  }

  "DigitalPackValidation.passes" should "succeed for a standard country and currency combination" in {
    val requestMissingState = validDigitalPackRequest.copy(country = Country.UK, product = DigitalPack(Currency.GBP, Annual), state = None)
    DigitalPackValidation.passes(requestMissingState) shouldBe true
  }

  "DigitalPackValidation.passes" should "fail if the country and currency combination is unsupported" in {
    val requestMissingState = validDigitalPackRequest.copy(country = Country.US, product = DigitalPack(Currency.GBP, Annual), state = None)
    DigitalPackValidation.passes(requestMissingState) shouldBe false
  }

}

class PaperValidationTest extends FlatSpec with Matchers {

  import TestData.validPaperRequest

  "PaperValidation.passes" should "fail if the country is US" in {
    val requestDeliveredToUs = validPaperRequest.copy(country = Country.US)
    PaperValidation.passes(requestDeliveredToUs) shouldBe false
  }

  "PaperValidation.passes" should "fail if the currency is USD" in {
    val requestDeliveredToUs = validPaperRequest.copy(product = Paper(Currency.USD, Monthly, HomeDelivery, Everyday))
    PaperValidation.passes(requestDeliveredToUs) shouldBe false
  }

  "PaperValidation.passes" should "succeed if the country is UK and the currency is GBP" in {
    val requestDeliveredToUs = validPaperRequest
    PaperValidation.passes(requestDeliveredToUs) shouldBe true
  }

}

object TestData {

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

  val validPaperRequest = CreateSupportWorkersRequest(
    firstName = "grace",
    lastName = "hopper",
    country = Country.UK,
    state = None,
    product = Paper(Currency.GBP, Monthly, HomeDelivery, Everyday),
    firstDeliveryDate = None,
    paymentFields = StripePaymentFields("test-token"),
    ophanIds = OphanIds(None, None, None),
    referrerAcquisitionData = ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com",
    telephoneNumber = None,
    promoCode = None,
    addressLine1 = Some("Address Line 1"),
    addressLine2 = Some("Address Line 2"),
    townCity = Some("Address Town"),
    county = None,
    postcode = Some("N1 9AG")
  )

}
