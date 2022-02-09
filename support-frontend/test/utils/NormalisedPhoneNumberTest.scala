package utils

import com.gu.i18n.Country
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class NormalisedPhoneNumberTest extends AnyFlatSpec with Matchers {

  "fromStringAndCountry" should "return None when an invalid number is provided" in {
    NormalisedTelephoneNumber.fromStringAndCountry(":)", Country.UK) should be(Symbol("left"))
    NormalisedTelephoneNumber.fromStringAndCountry("000000000000000000000000", Country.UK) should be(Symbol("left"))
    NormalisedTelephoneNumber.fromStringAndCountry("07777777", Country.UK) should be(Symbol("left"))
  }
  "fromStringAndCountry" should "process a UK local number (Kings Place) with spaces" in {
    NormalisedTelephoneNumber.fromStringAndCountry("020 3353 2000", Country.UK) shouldBe Right(
      NormalisedTelephoneNumber("44", "2033532000"),
    )
  }
  "fromStringAndCountry" should "process a UK local number without spaces" in {
    NormalisedTelephoneNumber.fromStringAndCountry("02033532000", Country.UK) shouldBe Right(
      NormalisedTelephoneNumber("44", "2033532000"),
    )
  }
  "fromStringAndCountry" should "process a UK local number without a leading 0" in {
    NormalisedTelephoneNumber.fromStringAndCountry("2033532000", Country.UK) shouldBe Right(
      NormalisedTelephoneNumber("44", "2033532000"),
    )
  }
  "fromStringAndCountry" should "process a UK local number with a preceding 0044" in {
    NormalisedTelephoneNumber.fromStringAndCountry("00442033532000", Country.UK) shouldBe Right(
      NormalisedTelephoneNumber("44", "2033532000"),
    )
  }
  "fromStringAndCountry" should "process a UK local number with a preceding +44" in {
    NormalisedTelephoneNumber.fromStringAndCountry("+442033532000", Country.UK) shouldBe Right(
      NormalisedTelephoneNumber("44", "2033532000"),
    )
  }
  "fromStringAndCountry" should "process a UK local number with a preceding +44 from Ireland" in {
    NormalisedTelephoneNumber.fromStringAndCountry("+442033532000", Country.Ireland) shouldBe Right(
      NormalisedTelephoneNumber("44", "2033532000"),
    )
  }
  "fromStringAndCountry" should "process a UK local number with a preceding +44 from the US" in {
    NormalisedTelephoneNumber.fromStringAndCountry("+442033532000", Country.US) shouldBe Right(
      NormalisedTelephoneNumber("44", "2033532000"),
    )
  }
  "fromStringAndCountry" should "process a UK local number with a preceding +44 from Australia" in {
    NormalisedTelephoneNumber.fromStringAndCountry("+442033532000", Country.Australia) shouldBe Right(
      NormalisedTelephoneNumber("44", "2033532000"),
    )
  }
  "fromStringAndCountry" should "process a US local number (NY office) with dashes" in {
    NormalisedTelephoneNumber.fromStringAndCountry("212-231-7762", Country.US) shouldBe Right(
      NormalisedTelephoneNumber("1", "2122317762"),
    )
  }
  "fromStringAndCountry" should "process a US local number with brackets" in {
    NormalisedTelephoneNumber.fromStringAndCountry("212(231)7762", Country.US) shouldBe Right(
      NormalisedTelephoneNumber("1", "2122317762"),
    )
  }
  "fromStringAndCountry" should "process a US local number with  a leading +1" in {
    NormalisedTelephoneNumber.fromStringAndCountry("+12122317762", Country.US) shouldBe Right(
      NormalisedTelephoneNumber("1", "2122317762"),
    )
  }
  "fromStringAndCountry" should "process a US local number with  a leading +1 from Canada" in {
    NormalisedTelephoneNumber.fromStringAndCountry("+12122317762", Country.Canada) shouldBe Right(
      NormalisedTelephoneNumber("1", "2122317762"),
    )
  }
  "fromStringAndCountry" should "process an AU local number (Sydney) with spaces" in {
    NormalisedTelephoneNumber.fromStringAndCountry("02 8076 8500", Country.Australia) shouldBe Right(
      NormalisedTelephoneNumber("61", "280768500"),
    )
  }
  "fromStringAndCountry" should "process an AU local number (Sydney) with leading +61" in {
    NormalisedTelephoneNumber.fromStringAndCountry("+612 8076 8500", Country.Australia) shouldBe Right(
      NormalisedTelephoneNumber("61", "280768500"),
    )
  }
}
