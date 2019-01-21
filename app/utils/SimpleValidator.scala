package utils

import com.gu.i18n.Country
import com.gu.support.workers.{DirectDebitPaymentFields, PaymentFields, StripePaymentFields}
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

    noEmptyNameFields && hasStateIfRequired && noEmptyPaymentFields
  }
}
