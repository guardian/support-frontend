package services.stepfunctions

import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.{Country, Currency}
import com.gu.support.workers._
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}
import services.stepfunctions.PaymentFieldsEmbellisher._

class PaymentFieldsEmbellisherTest extends FlatSpec with Matchers with MockitoSugar {

  val digitalPackProduct = DigitalPack(
    currency = Currency.USD,
    billingPeriod = Monthly
  )

  val directDebitPaymentFieldsFromClient = DirectDebitPaymentFields(
    accountHolderName = "oscar the grouch",
    sortCode = "200000",
    accountNumber = "55779911",
    None,
    None,
    None,
    None,
    None
  )

  val stripePaymentFields = StripePaymentFields("test-token")

  val directDebitRequest = CreateSupportWorkersRequest(
    firstName = "oscar",
    lastName = "the grouch",
    addressLine1 = Some("123 trash alley"),
    addressLine2 = Some("bin 5"),
    townCity = Some("London"),
    country = Country.UK,
    state = None,
    product = digitalPackProduct,
    county = None,
    postcode = Some("w37ab"),
    paymentFields = directDebitPaymentFieldsFromClient,
    ophanIds = OphanIds(None, None, None),
    referrerAcquisitionData = ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "oscarthegrouch@gu.com",
    telephoneNumber = None,
    promoCode = None
  )

  "paymentFields" should "add address info to the payment fields for direct debit when there's only one address line" in {

    val directDebitRequestAddressLine1Only = directDebitRequest.copy(addressLine2 = None)
    val expected = DirectDebitPaymentFields(
      accountHolderName = "oscar the grouch",
      sortCode = "200000",
      accountNumber = "55779911",
      postalCode = Some("w37ab"),
      city = Some("London"),
      state = None,
      streetName = Some("trash alley"),
      streetNumber = Some("123")
    )

    val transformed = paymentFields(directDebitRequestAddressLine1Only)
    transformed shouldBe expected

  }

  "paymentFields" should "add address info to the payment fields for direct debit when there are two address lines" in {

    val expected = DirectDebitPaymentFields(
      accountHolderName = "oscar the grouch",
      sortCode = "200000",
      accountNumber = "55779911",
      postalCode = Some("w37ab"),
      city = Some("London"),
      state = None,
      streetName = Some("trash alley, bin 5"),
      streetNumber = Some("123")
    )

    val transformed = paymentFields(directDebitRequest)
    transformed shouldBe expected

  }

  "paymentFields" should "add address info to the payment fields for direct debit when there are two address lines and " +
    "the second line has the street number" in {

    val directDebitRequestLinesSwapped = directDebitRequest.copy(addressLine1 = directDebitRequest.addressLine2, addressLine2 = directDebitRequest.addressLine1)
    val expected = DirectDebitPaymentFields(
      accountHolderName = "oscar the grouch",
      sortCode = "200000",
      accountNumber = "55779911",
      postalCode = Some("w37ab"),
      city = Some("London"),
      state = None,
      streetName = Some("trash alley, bin 5"),
      streetNumber = Some("123")
    )

    val transformed = paymentFields(directDebitRequestLinesSwapped)
    transformed shouldBe expected

  }

  "paymentFields" should "return the payment fields back when there are no address details (as contributions will do)" in {

    val directDebitRequestNoAddress = CreateSupportWorkersRequest(
      firstName = "oscar",
      lastName = "the grouch",
      addressLine1 = None,
      addressLine2 = None,
      townCity = None,
      country = Country.UK,
      state = None,
      product = digitalPackProduct,
      county = None,
      postcode = None,
      paymentFields = directDebitPaymentFieldsFromClient,
      ophanIds = OphanIds(None, None, None),
      referrerAcquisitionData = ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None),
      supportAbTests = Set(),
      email = "oscarthegrouch@gu.com",
      telephoneNumber = None,
      promoCode = None
    )

    val expected = DirectDebitPaymentFields(
      accountHolderName = "oscar the grouch",
      sortCode = "200000",
      accountNumber = "55779911",
      postalCode = None,
      city = None,
      state = None,
      streetName = None,
      streetNumber = None
    )

    val transformed = paymentFields(directDebitRequestNoAddress)
    transformed shouldBe expected

  }

  "paymentFields" should "return stripe payment fields back without modifying them" in {

    val requestWithStripePaymentFields = directDebitRequest.copy(paymentFields = stripePaymentFields)

    paymentFields(requestWithStripePaymentFields) shouldBe stripePaymentFields
  }

  "paymentFields" should "clip street names longer than 100 characters due to Zuora's character limit" in {

    val longAddressDirectDebitRequest = directDebitRequest.copy(
      addressLine1 = Some("123 some super long street name oh wow it is so long does anyone live here street"),
      addressLine2 = Some("hi friend it is me another really long address line and so i will get cut off before " +
        "i have said all there is to say how cruel")
    )

    val expected = DirectDebitPaymentFields(
      accountHolderName = "oscar the grouch",
      sortCode = "200000",
      accountNumber = "55779911",
      postalCode = Some("w37ab"),
      city = Some("London"),
      state = None,
      streetName = Some("some super long street name oh wow it is so long does anyone live here street, hi friend it is me an"),
      streetNumber = Some("123")
    )

    val transformed = paymentFields(longAddressDirectDebitRequest)
    transformed shouldBe expected

  }

}
