package com.gu.acquisitions

import com.gu.support.catalog._
import com.gu.support.workers.lambdas.SendAcquisitionEventOld.paymentProviderFromPaymentMethod
import com.gu.support.workers.states.SendThankYouEmailState.{SendThankYouEmailContributionState, SendThankYouEmailDigitalSubscriptionCorporateRedemptionState, SendThankYouEmailDigitalSubscriptionDirectPurchaseState, SendThankYouEmailDigitalSubscriptionGiftPurchaseState, SendThankYouEmailDigitalSubscriptionGiftRedemptionState, SendThankYouEmailGuardianWeeklyState, SendThankYouEmailPaperState}
import com.gu.support.workers.states.{SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.support.workers.{Annual, BillingPeriod, ClonedDirectDebitPaymentMethod, Contribution, CreditCardReferenceTransaction, DigitalPack, DirectDebitPaymentMethod, GuardianWeekly, Monthly, Paper, PayPalReferenceTransaction, PaymentMethod, ProductType, Quarterly, SixWeekly, StripePaymentType}

object AcquisitionTableRowBuilder {
  def buildAcquisitionTableRow(state: SendThankYouEmailState) = {
    val (productType, amount) = productTypeAndAmount(state)
    val row = Map(
      "product" -> productType,
      "amount" -> amount,
      "print_options.product" -> printOptionsFromProduct(state.product),
      "payment_frequency" -> paymentFrequencyFromBillingPeriod(state.product.billingPeriod),
      "country_code" -> state.user.billingAddress.country.alpha2,
      "currency" -> state.product.currency.iso,
      "payment_provider" -> maybePaymentProvider(state)
    )
  }

  def productTypeAndAmount(state: SendThankYouEmailState) = state.product match {
    case c: Contribution => ("RECURRING_CONTRIBUTION", c.amount.toDouble)
    case _: DigitalPack => ("DIGITAL_SUBSCRIPTION", 0D)
    case _: Paper => ("PRINT_SUBSCRIPTION", 0D)
    case _: GuardianWeekly => ("PRINT_SUBSCRIPTION", 0D)
  }

  def printOptionsFromProduct(product: ProductType): Option[String] = {

    def printProduct(fulfilmentOptions: FulfilmentOptions, productOptions: ProductOptions): String = {
      (fulfilmentOptions, productOptions) match {
        case (HomeDelivery, Everyday) => "HOME_DELIVERY_EVERYDAY"
        case (HomeDelivery, EverydayPlus) => "HOME_DELIVERY_EVERYDAY_PLUS"
        case (HomeDelivery, Sixday) => "HOME_DELIVERY_SIXDAY"
        case (HomeDelivery, SixdayPlus) => "HOME_DELIVERY_SIXDAY_PLUS"
        case (HomeDelivery, Weekend) => "HOME_DELIVERY_WEEKEND"
        case (HomeDelivery, WeekendPlus) => "HOME_DELIVERY_WEEKEND_PLUS"
        case (HomeDelivery, Saturday) => "HOME_DELIVERY_SATURDAY"
        case (HomeDelivery, SaturdayPlus) => "HOME_DELIVERY_SATURDAY_PLUS"
        case (HomeDelivery, Sunday) => "HOME_DELIVERY_SUNDAY"
        case (HomeDelivery, SundayPlus) => "HOME_DELIVERY_SUNDAY_PLUS"
        case (Collection, Everyday) => "VOUCHER_EVERYDAY"
        case (Collection, EverydayPlus) => "VOUCHER_EVERYDAY_PLUS"
        case (Collection, Sixday) => "VOUCHER_SIXDAY"
        case (Collection, SixdayPlus) => "VOUCHER_SIXDAY_PLUS"
        case (Collection, Weekend) => "VOUCHER_WEEKEND"
        case (Collection, WeekendPlus) => "VOUCHER_WEEKEND_PLUS"
        case (Collection, Saturday) => "VOUCHER_SATURDAY"
        case (Collection, SaturdayPlus) => "VOUCHER_SATURDAY_PLUS"
        case (Collection, Sunday) => "VOUCHER_SUNDAY"
        case _ => "VOUCHER_SUNDAY_PLUS"
      }
    }

    product match {
      case p: Paper => Some(printProduct(p.fulfilmentOptions, p.productOptions))
      case _: GuardianWeekly => Some("GUARDIAN_WEEKLY")
      case _ => None
    }
  }

  def paymentFrequencyFromBillingPeriod(billingPeriod: BillingPeriod) =
    billingPeriod match {
      case Monthly => "MONTHLY"
      case Quarterly | SixWeekly => "QUARTERLY"
      case Annual => "ANNUALLY"
    }

  def maybePaymentProvider(s: SendThankYouEmailState): Option[String] = (s match {
    case s: SendThankYouEmailContributionState => Some(s.paymentMethod)
    case s: SendThankYouEmailDigitalSubscriptionDirectPurchaseState => Some(s.paymentMethod)
    case s: SendThankYouEmailDigitalSubscriptionGiftPurchaseState => Some(s.paymentMethod)
    case s: SendThankYouEmailPaperState => Some(s.paymentMethod)
    case s: SendThankYouEmailGuardianWeeklyState => Some(s.paymentMethod)
    case _: SendThankYouEmailDigitalSubscriptionCorporateRedemptionState => None
    case _: SendThankYouEmailDigitalSubscriptionGiftRedemptionState => None
  }).map(paymentProviderFromPaymentMethod)

  def paymentProviderFromPaymentMethod(paymentMethod: PaymentMethod) =
    paymentMethod match {
      case creditCardPayment: CreditCardReferenceTransaction =>
        creditCardPayment.stripePaymentType match {
          case Some(StripePaymentType.StripeApplePay) => "STRIPE_APPLE_PAY"
          case Some(StripePaymentType.StripePaymentRequestButton) => "STRIPE_PAYMENT_REQUEST_BUTTON"
          case _ => "STRIPE"
        }
      case _: PayPalReferenceTransaction => "PAYPAL"
      case _: DirectDebitPaymentMethod | _: ClonedDirectDebitPaymentMethod => "GOCARDLESS"
    }
}
