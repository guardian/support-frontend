package com.gu.salesforce

import com.gu.salesforce.AddressLineTransformer.combinedAddressLine
import com.gu.support.workers.Address

import scala.util.matching.Regex

object AddressLineTransformer {

  def combinedAddressLine(addressLine1: Option[String], addressLine2: Option[String]): Option[AddressLine] = {

    def singleAddressLine(addressLine: String): AddressLine = {
      val pattern: Regex = "([0-9]+) (.+)".r

      addressLine match {
        case pattern(streetNumber, streetName) => AddressLine(Some(streetNumber), streetName)
        case _ => AddressLine(None, addressLine)
      }
    }

    val addressLine1MaybeSplit: Option[AddressLine] = addressLine1.map(singleAddressLine)
    val addressLine2MaybeSplit: Option[AddressLine] = addressLine2.map(singleAddressLine)

    def concatStreetNames(firstStreetName: String, secondStreetName: String): String =
      s"$firstStreetName, $secondStreetName"

    val combinedLine = (addressLine1MaybeSplit, addressLine2MaybeSplit) match {
      case (None, None) => None
      case (Some(line1), None) => Some(line1)
      case (None, Some(line2)) => Some(line2)
      case (Some(line1), Some(line2)) => {
        if (line1.streetNumber.isDefined) {
          Some(AddressLine(line1.streetNumber, concatStreetNames(line1.streetName, line2.streetName)))
        } else if (line2.streetNumber.isDefined) {
          Some(AddressLine(line2.streetNumber, concatStreetNames(line2.streetName, line1.streetName)))
        } else {
          Some(AddressLine(None, concatStreetNames(line1.streetName, line2.streetName)))
        }
      }
    }
    combinedLine
  }

  def clipForZuoraStreetNameLimit(addressLine: AddressLine): AddressLine = {
    if (addressLine.streetName.length > 100) {
      // we are sometimes putting extra info into streetName but zuora's character limit is 100
      AddressLine(addressLine.streetNumber, addressLine.streetName.take(100))
    } else addressLine
  }
}

case class AddressLine(streetNumber: Option[String], streetName: String)

object AddressLine {

  def getAddressLine(address: Address): Option[String] = combinedAddressLine(
    address.lineOne,
    address.lineTwo,
  ).map(asFormattedString)

  def asFormattedString(addressLine: AddressLine): String = {
    val streetNumberString = addressLine.streetNumber match {
      case Some(number) => s"$number "
      case None => ""
    }

    s"$streetNumberString${addressLine.streetName}"
  }

}
