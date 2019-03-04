package utils

import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.{Country, Currency}
import com.gu.support.catalog.{Everyday, HomeDelivery}
import com.gu.support.workers._
import org.joda.time.LocalDate
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

}

class DigitalPackValidationTest extends FlatSpec with Matchers {

  import TestData.validDigitalPackRequest

  "DigitalPackValidation.passes" should "fail if the country is US and there is no state selected" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.US, state = None),
    )
    DigitalPackValidation.passes(requestMissingState) shouldBe false
  }

  "DigitalPackValidation.passes" should "also fail if the country is Canada and there is no state selected" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.Canada, state = None),
    )
    DigitalPackValidation.passes(requestMissingState) shouldBe false
  }

  "DigitalPackValidation.passes" should "pass if there is no state selected and the country is Australia" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.Australia, state = None),
      product = DigitalPack(Currency.AUD, Monthly)
    )
    DigitalPackValidation.passes(requestMissingState) shouldBe true
  }

  "DigitalPackValidation.passes" should "fail if the payment field received is an empty string" in {
    val requestMissingState = validDigitalPackRequest.copy(paymentFields = StripePaymentFields(""))
    DigitalPackValidation.passes(requestMissingState) shouldBe false
  }

  "DigitalPackValidation.passes" should "succeed for a standard country and currency combination" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.UK, state = None),
      product = DigitalPack(Currency.GBP, Annual),
    )
    DigitalPackValidation.passes(requestMissingState) shouldBe true
  }

  "DigitalPackValidation.passes" should "fail if the country and currency combination is unsupported" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.US, state = Some("VA")),
      product = DigitalPack(Currency.GBP, Annual)
    )
    DigitalPackValidation.passes(requestMissingState) shouldBe false
  }

}

class PaperValidationTest extends FlatSpec with Matchers {

  import TestData.validPaperRequest

  "PaperValidation.passes" should "fail if the delivery country is US" in {
    val requestDeliveredToUs = validPaperRequest.copy(deliveryAddress = validPaperRequest.deliveryAddress map(_.copy(country = Country.US)))
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

  "PaperValidation.passes" should "fail if there is no first delivery date" in {
    val requestDeliveredToUs = validPaperRequest.copy(firstDeliveryDate = None)
    PaperValidation.passes(requestDeliveredToUs) shouldBe false
  }

}

object TestData {

  val validDigitalPackRequest = CreateSupportWorkersRequest(
    firstName = "grace",
    lastName = "hopper",
    product = DigitalPack(Currency.USD, Monthly),
    firstDeliveryDate = None,
    paymentFields = StripePaymentFields("test-token"),
    ophanIds = OphanIds(None, None, None),
    referrerAcquisitionData = ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com",
    telephoneNumber = None,
    promoCode = None,
    billingAddress = Address(
      None,
      None,
      None,
      state = Some("VA"),
      None,
      country = Country.US,
    ),
    deliveryAddress = None
  )

  val someDateNextMonth = new LocalDate().plusMonths(1)
  val paperAddress = Address(
    lineOne = Some("Address Line 1"),
    lineTwo = Some("Address Line 2"),
    city = Some("Address Town"),
    state = None,
    postCode = Some("N1 9AG"),
    country = Country.UK
  )
  val validPaperRequest = CreateSupportWorkersRequest(
    firstName = "grace",
    lastName = "hopper",
    product = Paper(Currency.GBP, Monthly, HomeDelivery, Everyday),
    firstDeliveryDate = Some(someDateNextMonth),
    paymentFields = StripePaymentFields("test-token"),
    ophanIds = OphanIds(None, None, None),
    referrerAcquisitionData = ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com",
    telephoneNumber = None,
    promoCode = None,
    billingAddress = paperAddress,
    deliveryAddress = Some(paperAddress)
  )

}
