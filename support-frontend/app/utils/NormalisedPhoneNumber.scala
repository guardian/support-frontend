package utils

import com.google.i18n.phonenumbers.PhoneNumberUtil
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber
import com.gu.i18n.Country
import com.gu.monitoring.SafeLogger

import scala.util.{Failure, Success, Try}

case class NormalisedTelephoneNumber(countryCode: String, localNumber: String)

object NormalisedTelephoneNumber {

  private def asFormattedString(normalisedTelephoneNumber: NormalisedTelephoneNumber): String =
    s"+${normalisedTelephoneNumber.countryCode}${normalisedTelephoneNumber.localNumber}"

  def formatFromStringAndCountry(phoneNumber: String, country: Country): Either[String, String] = {
    fromStringAndCountry(phoneNumber, country).map(asFormattedString)
  }
  def fromStringAndCountry(phoneNumber: String, country: Country): Either[String, NormalisedTelephoneNumber] = {
    val phoneNumberUtil = PhoneNumberUtil.getInstance()
    val countryCode = country.alpha2

    val parsed = Try(phoneNumberUtil.parse(phoneNumber, countryCode)).toEither
    val withError = parsed.left.map { err =>
      s"We tried to normalise number $phoneNumber, countryCode: $countryCode but something went wrong: ${err.toString}"
    }
    val validated = withError.filterOrElse(
      phoneNumberUtil.isValidNumber,
      s"We tried to normalise number $phoneNumber, countryCode: $countryCode but it was not a valid number",
    )
    validated.map(parsed =>
      NormalisedTelephoneNumber(parsed.getCountryCode.toString, parsed.getNationalNumber.toString),
    )
  }

}
