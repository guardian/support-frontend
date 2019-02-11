package utils

import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.workers.{DirectDebitPaymentFields, StripePaymentFields}
import services.stepfunctions.CreateSupportWorkersRequest

object SimpleValidator {

  def validationPasses(request: CreateSupportWorkersRequest): Boolean = {
    val noEmptyNameFields = !request.firstName.isEmpty && !request.lastName.isEmpty

    def hasStateIfRequired: Boolean = {
      if (request.country == Country.US || request.country == Country.Canada) {
        request.state.isDefined
      } else true
    }

    def noEmptyPaymentFields: Boolean = request.paymentFields match {
      case directDebitDetails: DirectDebitPaymentFields =>
        !directDebitDetails.accountHolderName.isEmpty && !directDebitDetails.accountNumber.isEmpty && !directDebitDetails.sortCode.isEmpty
      case stripeDetails: StripePaymentFields => !stripeDetails.stripeToken.isEmpty
    }

    def currencyIsSupportedForCountry: Boolean = {
      val countryGroupsForCurrency = CountryGroup.allGroups.filter(_.currency == request.product.currency)
      countryGroupsForCurrency.flatMap(_.countries).contains(request.country)
    }

    val telephoneNumberShortEnough = request.telephoneNumber.forall(_.length < 40)

    noEmptyNameFields && hasStateIfRequired && noEmptyPaymentFields && telephoneNumberShortEnough && currencyIsSupportedForCountry
  }
}
