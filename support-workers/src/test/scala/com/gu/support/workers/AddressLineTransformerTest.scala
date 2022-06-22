package com.gu.support.workers

import com.gu.i18n.Currency
import com.gu.salesforce.AddressLine
import com.gu.salesforce.AddressLineTransformer.combinedAddressLine
import com.gu.salesforce.AddressLineTransformer.clipForZuoraStreetNameLimit
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar

class AddressLineTransformerTest extends AnyFlatSpec with Matchers with MockitoSugar {

  val digitalPackProduct = DigitalPack(
    currency = Currency.USD,
    billingPeriod = Monthly,
  )

  val directDebitPaymentFieldsFromClient = DirectDebitPaymentFields(
    accountHolderName = "oscar the grouch",
    sortCode = "200000",
    accountNumber = "55779911",
    recaptchaToken = "test",
  )

  "combinedAddressLine" should "return an AddressLine when there is only a lineOne" in {

    val lineOne = Some("123 trash alley")
    val lineTwo = None

    val combined = combinedAddressLine(lineOne, lineTwo)

    val expected = Some(AddressLine(Some("123"), "trash alley"))

    combined shouldBe expected
  }

  "combinedAddressLine" should "return an AddressLine when there is lineOne and a lineTwo" in {

    val lineOne = Some("123 trash alley")
    val lineTwo = Some("bin 5")

    val combined = combinedAddressLine(lineOne, lineTwo)

    val expected = Some(AddressLine(Some("123"), "trash alley, bin 5"))

    combined shouldBe expected
  }

  "combinedAddressLine" should "None when there is neither a lineOne nor a lineTwo" in {

    val combined = combinedAddressLine(None, None)

    val expected = None

    combined shouldBe expected
  }

  "combinedAddressLine" should "still return an AddressLine when there are two address lines and " +
    "the second line has the street number" in {

      val lineOne = Some("bin 5")
      val lineTwo = Some("123 trash alley")

      val combined = combinedAddressLine(lineOne, lineTwo)

      val expected = Some(AddressLine(Some("123"), "trash alley, bin 5"))

      combined shouldBe expected
    }

  "clipForZuoraStreetNameLimit" should "clip street name to 100 characters" in {
    val tooLongStreetName = "trash alley, bin 5, you know how to find that particular bin because it is the one with " +
      "the fairy lights that never come down"

    val addressLine = AddressLine(Some("123"), tooLongStreetName)

    val clipped = clipForZuoraStreetNameLimit(addressLine)

    val expected = AddressLine(
      streetNumber = Some("123"),
      streetName =
        "trash alley, bin 5, you know how to find that particular bin because it is the one with the fairy li",
    )

    clipped shouldBe expected
  }

  "asFormattedString" should "combine a street number and a street name" in {
    val addressLine = AddressLine(Some("123"), "trash alley, bin 5")
    AddressLine.asFormattedString(addressLine) shouldBe "123 trash alley, bin 5"
  }

  "asFormattedString" should "just return street name if there is no street number" in {
    val addressLine = AddressLine(None, "trash alley, bin 5")
    AddressLine.asFormattedString(addressLine) shouldBe "trash alley, bin 5"
  }
}
