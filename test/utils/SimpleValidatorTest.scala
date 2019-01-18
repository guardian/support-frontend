package utils

import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.{Country, Currency}
import com.gu.support.workers.{DigitalPack, Monthly, StripePaymentFields}
import org.scalatest.{FlatSpec, Matchers}
import services.stepfunctions.CreateSupportWorkersRequest

class SimpleValidatorTest extends FlatSpec with Matchers {

  val validRequest = CreateSupportWorkersRequest(
    firstName = "grace",
    lastName = "hopper",
    country = Country.US,
    state = Some("VA"),
    product = DigitalPack(Currency.USD, Monthly),
    paymentFields = StripePaymentFields("test-token"),
    ophanIds = OphanIds(None, None, None),
    referrerAcquisitionData = ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com"
  )

  "validate" should "return true when there are no empty strings" in {
    SimpleValidator.validationPasses(validRequest) shouldBe true
  }

  "validate" should "reject empty strings in the name field" in {
    val requestMissingFirstName = validRequest.copy(firstName = "")
    SimpleValidator.validationPasses(requestMissingFirstName) shouldBe false
  }

  "validate" should "fail if the country is US and there is no state selected" in {
    val requestMissingState = validRequest.copy(state = None)
    SimpleValidator.validationPasses(requestMissingState) shouldBe false
  }

  "validate" should "also fail if the country is Canada and there is no state selected" in {
    val requestMissingState = validRequest.copy(country = Country.Canada, state = None)
    SimpleValidator.validationPasses(requestMissingState) shouldBe false
  }

  "validate" should "pass if there is no state selected and the country is Australia" in {
    val requestMissingState = validRequest.copy(country = Country.Australia, state = None)
    SimpleValidator.validationPasses(requestMissingState) shouldBe true
  }

  "validate" should "fail if the payment field received is an empty string" in {
    val requestMissingState = validRequest.copy(paymentFields = StripePaymentFields(""))
    SimpleValidator.validationPasses(requestMissingState) shouldBe false
  }

}
