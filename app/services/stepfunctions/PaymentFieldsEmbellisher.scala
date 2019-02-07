package services.stepfunctions

import com.gu.support.workers.{DirectDebitPaymentFields, PaymentFields}

import scala.util.matching.Regex

object PaymentFieldsEmbellisher {

  case class AddressLine(streetNumber: Option[String], streetName: String)

  def combinedAddressLine(addressLine1: Option[String], addressLine2: Option[String]): Option[AddressLine] = {

    def singleAddressLine(addressLine1: String): AddressLine = {
      val pattern: Regex = "([0-9]+) (.+)".r

      addressLine1 match {
        case pattern(streetNumber, streetName) => AddressLine(Some(streetNumber), streetName)
        case _ => AddressLine(None, addressLine1)
      }
    }

    val addressLine1MaybeSplit: Option[AddressLine] = addressLine1.map(singleAddressLine)
    val addressLine2MaybeSplit: Option[AddressLine] = addressLine2.map(singleAddressLine)

    def concatStreetNames(firstStreetName: String, secondStreetName: String): String = s"$firstStreetName, $secondStreetName"

    val combinedLine = (addressLine1MaybeSplit, addressLine2MaybeSplit) match {
      case (None, None) => None
      case (Some(line1), None) => Some(line1)
      case (None, Some(line2)) => Some(line2)
      case (Some(line1), Some(line2)) => {
        if(line1.streetNumber.isDefined) {
          Some(AddressLine(line1.streetNumber, concatStreetNames(line1.streetName, line2.streetName)))
        }
        else if(line2.streetNumber.isDefined){
          Some(AddressLine(line2.streetNumber, concatStreetNames(line2.streetName, line1.streetName)))
        }
        else {
          Some(AddressLine(None, concatStreetNames(line1.streetName, line2.streetName)))
        }
      }
    }

    combinedLine map { line =>
      if (line.streetName.length > 100) {
        //we are sometimes putting extra info into streetName but zuora's character limit is 100
        AddressLine(line.streetNumber, line.streetName.take(100))
      }
      else line
    }
  }

  def paymentFields(request: CreateSupportWorkersRequest): PaymentFields = {
    request.paymentFields match {
      case dd: DirectDebitPaymentFields => {
        val addressLine: Option[AddressLine] = combinedAddressLine(request.addressLine1, request.addressLine2)
        DirectDebitPaymentFields(
          accountHolderName = dd.accountHolderName,
          sortCode = dd.sortCode,
          accountNumber = dd.accountNumber,
          city = request.townCity,
          postalCode = request.postcode,
          state = request.state,
          streetName = addressLine.map(_.streetName),
          streetNumber = addressLine.flatMap(_.streetNumber)
        )
      }
      case pf: PaymentFields => pf
    }
  }

}
