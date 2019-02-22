package utils

import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.workers._
import services.stepfunctions.CreateSupportWorkersRequest

object CheckoutValidationRules {
  def validatorFor(productType: ProductType): CreateSupportWorkersRequest => Boolean = productType match {
    case digitalPack: DigitalPack => DigitalPackValidation.passes
    case paper: Paper => PaperValidation.passes
    case _ => SimpleCheckoutFormValidation.passes
  }
}

object SimpleCheckoutFormValidation {

  def passes(createSupportWorkersRequest: CreateSupportWorkersRequest): Boolean = {
    noEmptyNameFields(createSupportWorkersRequest.firstName, createSupportWorkersRequest.lastName) &&
    noEmptyPaymentFields(createSupportWorkersRequest.paymentFields)
  }

  private def noEmptyNameFields(firstName: String, lastName: String) = !firstName.isEmpty && !lastName.isEmpty

  private def noEmptyPaymentFields(paymentFields: PaymentFields): Boolean = paymentFields match {
    case directDebitDetails: DirectDebitPaymentFields =>
      !directDebitDetails.accountHolderName.isEmpty && !directDebitDetails.accountNumber.isEmpty && !directDebitDetails.sortCode.isEmpty
    case stripeDetails: StripePaymentFields => !stripeDetails.stripeToken.isEmpty
    case payPalDetails: PayPalPaymentFields => !payPalDetails.baid.isEmpty
  }

}

object AddressAndCurrencyValidationRules {

    def deliveredToUkAndPaidInGbp(countryFromRequest: Country, currencyFromRequest: Currency): Boolean = {
      countryFromRequest == Country.UK && currencyFromRequest == GBP
    }

    def hasStateIfRequired(countryFromRequest: Country, stateFromRequest: Option[String], currencyFromRequest: Currency): Boolean = {
      if (countryFromRequest == Country.US || countryFromRequest == Country.Canada) {
        stateFromRequest.isDefined
      } else true
    }

    def currencyIsSupportedForCountry(countryFromRequest: Country, currencyFromRequest: Currency): Boolean = {
      val countryGroupsForCurrency = CountryGroup.allGroups.filter(_.currency == currencyFromRequest)
      countryGroupsForCurrency.flatMap(_.countries).contains(countryFromRequest)
    }

}

object DigitalPackValidation {

  import AddressAndCurrencyValidationRules._

  def passes(createSupportWorkersRequest: CreateSupportWorkersRequest): Boolean = {
    SimpleCheckoutFormValidation.passes(createSupportWorkersRequest) &&
    hasStateIfRequired(createSupportWorkersRequest.country, createSupportWorkersRequest.state, createSupportWorkersRequest.product.currency) &&
    currencyIsSupportedForCountry(createSupportWorkersRequest.country, createSupportWorkersRequest.product.currency)
  }
}

object PaperValidation {

  import AddressAndCurrencyValidationRules._

  def passes(createSupportWorkersRequest: CreateSupportWorkersRequest): Boolean = {
    SimpleCheckoutFormValidation.passes(createSupportWorkersRequest) &&
    deliveredToUkAndPaidInGbp(createSupportWorkersRequest.country, createSupportWorkersRequest.product.currency)
  }
}
