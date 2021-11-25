package utils

import com.google.i18n.phonenumbers.PhoneNumberUtil
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber
import com.gu.i18n.Country
import com.gu.monitoring.SafeLogger

import scala.util.{Failure, Success, Try}

case class NormalisedTelephoneNumber(countryCode: String, localNumber: String)

object NormalisedTelephoneNumber {

  def asFormattedString(normalisedTelephoneNumber: NormalisedTelephoneNumber): String =
    s"+${normalisedTelephoneNumber.countryCode}${normalisedTelephoneNumber.localNumber}"

  def fromStringAndCountry(phone: Option[String], country: Country): Option[NormalisedTelephoneNumber] = {
    for {
      number <- phone
      parsed <- parseToOption(number, country.alpha2)
    } yield {
      NormalisedTelephoneNumber(parsed.getCountryCode.toString, parsed.getNationalNumber.toString)
    }
  }

  private def parseToOption(phone: String, countryCode: String): Option[PhoneNumber] = {
    val phoneNumberUtil = PhoneNumberUtil.getInstance()

    Try(phoneNumberUtil.parse(phone, countryCode)) match {
      case Success(number) => {
        phoneNumberUtil.isValidNumber(number) match {
          case true => Some(number)
          case false => {
            SafeLogger.warn(s"We tried to normalise number $phone, countryCode: $countryCode but it was not a valid number")
            None
          }
        }
      }
      case Failure(err) => {
        SafeLogger.warn(s"We tried to normalise number $phone, countryCode: $countryCode but something went wrong: ${err.getMessage}")
        None
      }
    }
  }

}
