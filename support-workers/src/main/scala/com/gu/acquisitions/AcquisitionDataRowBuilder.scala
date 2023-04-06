package com.gu.acquisitions

import com.gu.i18n.Country
import com.gu.support.acquisitions.{AbTest, AcquisitionData, QueryParameter}
import com.gu.support.catalog._
import com.gu.support.promotions.{DefaultPromotions, PromoCode}
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.workers.states.{SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.support.workers.{
  AmazonPayPaymentMethod,
  Annual,
  BillingPeriod,
  ClonedDirectDebitPaymentMethod,
  Contribution,
  CreditCardReferenceTransaction,
  DigitalPack,
  DirectDebitPaymentMethod,
  GuardianWeekly,
  Monthly,
  Paper,
  PayPalReferenceTransaction,
  PaymentMethod,
  ProductType,
  Quarterly,
  RequestInfo,
  SepaPaymentMethod,
  SixWeekly,
  StripePaymentType,
  SupporterPlus,
}
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import org.joda.time.{DateTime, DateTimeZone}
import com.gu.support.acquisitions.models.AcquisitionType.{Purchase, Redemption}
import com.gu.support.acquisitions.models.PaymentProvider.{
  AmazonPay,
  DirectDebit,
  PayPal,
  Stripe,
  StripeApplePay,
  StripePaymentRequestButton,
  StripeSepa,
}
import com.gu.support.acquisitions.models.PrintProduct._
import com.gu.support.acquisitions.models.{
  AcquisitionDataRow,
  AcquisitionProduct,
  AcquisitionType,
  PaymentFrequency,
  PaymentProvider,
  PrintOptions,
  PrintProduct,
}
import com.gu.support.catalog.GuardianWeekly.postIntroductorySixForSixBillingPeriod
import com.gu.support.zuora.api.ReaderType

object AcquisitionDataRowBuilder {
  def buildFromState(state: SendAcquisitionEventState, requestInfo: RequestInfo): AcquisitionDataRow = {
    val commonState = state.sendThankYouEmailState
    val (acquisitionProduct, amount) = productTypeAndAmount(commonState.product)
    val acquisitionTypeDetails = getAcquisitionTypeDetails(commonState)
    val printOptions = printOptionsFromProduct(commonState.product, commonState.user.deliveryAddress.map(_.country))

    AcquisitionDataRow(
      eventTimeStamp = DateTime.now(DateTimeZone.UTC),
      product = acquisitionProduct,
      amount = amount,
      country = commonState.user.billingAddress.country,
      currency = commonState.product.currency,
      componentId = state.acquisitionData.flatMap(_.referrerAcquisitionData.componentId),
      componentType = state.acquisitionData.flatMap(_.referrerAcquisitionData.componentType),
      campaignCode = state.acquisitionData.flatMap(_.referrerAcquisitionData.campaignCode),
      source = state.acquisitionData.flatMap(_.referrerAcquisitionData.source),
      referrerUrl = state.acquisitionData.flatMap(_.referrerAcquisitionData.referrerUrl),
      abTests = state.acquisitionData.map(getAbTests).getOrElse(Nil),
      paymentFrequency = paymentFrequencyFromBillingPeriod(commonState.product.billingPeriod),
      paymentProvider = acquisitionTypeDetails.paymentMethod.map(paymentProviderFromPaymentMethod),
      printOptions = printOptions,
      browserId = state.acquisitionData.flatMap(_.ophanIds.browserId),
      identityId = Some(commonState.user.id),
      pageViewId = state.acquisitionData.flatMap(_.ophanIds.pageviewId),
      referrerPageViewId = state.acquisitionData.flatMap(_.referrerAcquisitionData.referrerPageviewId),
      labels = buildLabels(state, requestInfo.accountExists),
      promoCode = acquisitionTypeDetails.promoCode,
      reusedExistingPaymentMethod = requestInfo.accountExists,
      readerType = acquisitionTypeDetails.readerType,
      acquisitionType = acquisitionTypeDetails.acquisitionType,
      zuoraSubscriptionNumber = acquisitionTypeDetails.zuoraSubscriptionNumber,
      zuoraAccountNumber = acquisitionTypeDetails.zuoraAccountNumber,
      contributionId = None,
      paymentId = None,
      queryParameters = state.acquisitionData.map(getQueryParameters).getOrElse(Nil),
      platform = None,
    )
  }

  private def paymentFrequencyFromBillingPeriod(billingPeriod: BillingPeriod) =
    billingPeriod match {
      case Monthly => PaymentFrequency.Monthly
      case Quarterly => PaymentFrequency.Quarterly
      case SixWeekly if postIntroductorySixForSixBillingPeriod == Quarterly => PaymentFrequency.Quarterly
      case SixWeekly => PaymentFrequency.Monthly
      case Annual => PaymentFrequency.Annually
    }

  private def paymentProviderFromPaymentMethod(paymentMethod: PaymentMethod): PaymentProvider =
    paymentMethod match {
      case creditCardPayment: CreditCardReferenceTransaction =>
        creditCardPayment.StripePaymentType match {
          case Some(StripePaymentType.StripeApplePay) => StripeApplePay
          case Some(StripePaymentType.StripePaymentRequestButton) => StripePaymentRequestButton
          case _ => Stripe
        }
      case _: PayPalReferenceTransaction => PayPal
      case _: DirectDebitPaymentMethod | _: ClonedDirectDebitPaymentMethod => DirectDebit
      case _: SepaPaymentMethod => StripeSepa
      case _: AmazonPayPaymentMethod => AmazonPay
    }

  private def getAbTests(data: AcquisitionData): List[AbTest] =
    (data.supportAbTests ++ data.referrerAcquisitionData.abTests.getOrElse(Set())).toList

  private def productTypeAndAmount(product: ProductType): (AcquisitionProduct, Option[BigDecimal]) = product match {
    case c: Contribution => (AcquisitionProduct.RecurringContribution, Some(c.amount.toDouble))
    case s: SupporterPlus => (AcquisitionProduct.SupporterPlus, Some(s.amount.toDouble))
    case _: DigitalPack => (AcquisitionProduct.DigitalSubscription, None)
    case _: Paper => (AcquisitionProduct.Paper, None)
    case _: GuardianWeekly => (AcquisitionProduct.GuardianWeekly, None)
  }

  private def printOptionsFromProduct(product: ProductType, deliveryCountry: Option[Country]): Option[PrintOptions] = {

    def printProduct(fulfilmentOptions: FulfilmentOptions, productOptions: ProductOptions): PrintProduct =
      (fulfilmentOptions, productOptions) match {
        case (HomeDelivery, Everyday) => HomeDeliveryEveryday
        case (HomeDelivery, EverydayPlus) => HomeDeliveryEverydayPlus
        case (HomeDelivery, Sixday) => HomeDeliverySixday
        case (HomeDelivery, SixdayPlus) => HomeDeliverySixdayPlus
        case (HomeDelivery, Weekend) => HomeDeliveryWeekend
        case (HomeDelivery, WeekendPlus) => HomeDeliveryWeekendPlus
        case (HomeDelivery, Saturday) => HomeDeliverySaturday
        case (HomeDelivery, SaturdayPlus) => HomeDeliverySaturdayPlus
        case (HomeDelivery, Sunday) => HomeDeliverySunday
        case (HomeDelivery, SundayPlus) => HomeDeliverySundayPlus
        case (Collection, Everyday) => VoucherEveryday
        case (Collection, EverydayPlus) => VoucherEverydayPlus
        case (Collection, Sixday) => VoucherSixday
        case (Collection, SixdayPlus) => VoucherSixdayPlus
        case (Collection, Weekend) => VoucherWeekend
        case (Collection, WeekendPlus) => VoucherWeekendPlus
        case (Collection, Saturday) => VoucherSaturday
        case (Collection, SaturdayPlus) => VoucherSaturdayPlus
        case (Collection, Sunday) => VoucherSunday
        case _ => VoucherSundayPlus
      }

    product match {
      case p: Paper =>
        Some(
          PrintOptions(
            printProduct(p.fulfilmentOptions, p.productOptions),
            Country.UK,
          ),
        )
      case _: GuardianWeekly =>
        Some(
          PrintOptions(
            PrintProduct.GuardianWeekly,
            deliveryCountry.getOrElse(Country.UK),
          ),
        )
      case _ => None
    }
  }

  private def getAcquisitionTypeDetails(s: SendThankYouEmailState): AcquisitionTypeDetails =
    s match {
      case s: SendThankYouEmailContributionState =>
        AcquisitionTypeDetails(
          Some(s.paymentMethod),
          None,
          Direct,
          Purchase,
          Some(s.accountNumber),
          Some(s.subscriptionNumber),
        )
      case s: SendThankYouEmailSupporterPlusState =>
        AcquisitionTypeDetails(
          Some(s.paymentMethod),
          None,
          Direct,
          Purchase,
          Some(s.accountNumber),
          Some(s.subscriptionNumber),
        )
      case s: SendThankYouEmailDigitalSubscriptionDirectPurchaseState =>
        AcquisitionTypeDetails(
          Some(s.paymentMethod),
          s.promoCode,
          Direct,
          Purchase,
          Some(s.accountNumber),
          Some(s.subscriptionNumber),
        )
      case s: SendThankYouEmailDigitalSubscriptionGiftPurchaseState =>
        AcquisitionTypeDetails(
          Some(s.paymentMethod),
          s.promoCode,
          Gift,
          Purchase,
          Some(s.accountNumber),
          Some(s.subscriptionNumber),
        )
      case s: SendThankYouEmailPaperState =>
        AcquisitionTypeDetails(
          Some(s.paymentMethod),
          s.promoCode,
          Direct,
          Purchase,
          Some(s.accountNumber),
          Some(s.subscriptionNumber),
        )
      case s: SendThankYouEmailGuardianWeeklyState =>
        AcquisitionTypeDetails(
          Some(s.paymentMethod),
          s.promoCode,
          if (s.giftRecipient.isDefined) Gift else Direct,
          Purchase,
          Some(s.accountNumber),
          Some(s.subscriptionNumber),
        )
      case s: SendThankYouEmailDigitalSubscriptionGiftRedemptionState =>
        AcquisitionTypeDetails(
          None,
          None,
          Gift,
          Redemption,
          None, // TODO: if we rework digital gift modelling in Zuora we should include the relevant ids here
          None,
        )
    }

  private def buildLabels(state: SendAcquisitionEventState, accountExists: Boolean) = {
    val referrerLabels = state.acquisitionData.flatMap(_.referrerAcquisitionData.labels).getOrElse(Set())

    Set(
      if (accountExists) Some("REUSED_EXISTING_PAYMENT_METHOD") else None,
      if (isSixForSix(state)) Some("GUARDIAN_WEEKLY_SIX_FOR_SIX") else None,
      if (state.analyticsInfo.isGiftPurchase) Some("GIFT_SUBSCRIPTION") else None,
    ).flatten.union(referrerLabels).toList
  }

  private def isSixForSix(state: SendAcquisitionEventState) =
    state.sendThankYouEmailState match {
      case s: SendThankYouEmailGuardianWeeklyState =>
        s.product.billingPeriod == SixWeekly && s.promoCode.contains(DefaultPromotions.GuardianWeekly.NonGift.sixForSix)
      case _ => false
    }

  private def getQueryParameters(data: AcquisitionData): List[QueryParameter] =
    data.referrerAcquisitionData.queryParameters.getOrElse(Set()).toList

  case class AcquisitionTypeDetails(
      paymentMethod: Option[PaymentMethod],
      promoCode: Option[PromoCode],
      readerType: ReaderType,
      acquisitionType: AcquisitionType,
      zuoraAccountNumber: Option[String],
      zuoraSubscriptionNumber: Option[String],
  )

}
