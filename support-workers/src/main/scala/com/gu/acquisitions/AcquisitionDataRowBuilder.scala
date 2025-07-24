package com.gu.acquisitions

import com.gu.i18n.Country
import com.gu.support.acquisitions.{AbTest, AcquisitionData, QueryParameter}
import com.gu.support.catalog._
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.workers.states.{SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.support.workers.{
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
  StripePaymentType,
  SupporterPlus,
  TierThree,
  GuardianAdLite,
}
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import org.joda.time.{DateTime, DateTimeZone}
import com.gu.support.acquisitions.models.AcquisitionType.{Purchase, Redemption}
import com.gu.support.acquisitions.models.PaymentProvider.{
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
      labels = buildLabels(state),
      promoCode = acquisitionTypeDetails.promoCode,
      reusedExistingPaymentMethod = false,
      readerType = acquisitionTypeDetails.readerType,
      acquisitionType = acquisitionTypeDetails.acquisitionType,
      zuoraSubscriptionNumber = acquisitionTypeDetails.zuoraSubscriptionNumber,
      contributionId = None,
      paymentId = None,
      queryParameters = state.acquisitionData.map(getQueryParameters).getOrElse(Nil),
      platform = None,
      postalCode = commonState.user.billingAddress.postCode,
      state = commonState.user.billingAddress.state,
      email = Some(commonState.user.primaryEmailAddress),
      similarProductsConsent = commonState.similarProductsConsent,
      // For now always pass None here, even though this may be a PayPal transaction. We do set this for single PayPal
      // contributions. In future we can figure out whether it's worth finding the equivalent for a recurring PayPal
      // payment and wire this in, but it's currently not needed.
      paypalTransactionId = None,
    )
  }

  private def paymentFrequencyFromBillingPeriod(billingPeriod: BillingPeriod) =
    billingPeriod match {
      case Monthly => PaymentFrequency.Monthly
      case Quarterly => PaymentFrequency.Quarterly
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
    }

  private def getAbTests(data: AcquisitionData): List[AbTest] =
    (data.supportAbTests ++ data.referrerAcquisitionData.abTests.getOrElse(Set())).toList

  private def productTypeAndAmount(product: ProductType): (AcquisitionProduct, Option[BigDecimal]) = product match {
    case c: Contribution => (AcquisitionProduct.RecurringContribution, Some(c.amount.toDouble))
    case s: SupporterPlus =>
      (AcquisitionProduct.SupporterPlus, None) // we don't send S+ amount because it may be discounted
    case _: TierThree => (AcquisitionProduct.TierThree, None)
    case _: DigitalPack => (AcquisitionProduct.DigitalSubscription, None)
    case _: Paper => (AcquisitionProduct.Paper, None)
    case _: GuardianWeekly => (AcquisitionProduct.GuardianWeekly, None)
    case _: GuardianAdLite => (AcquisitionProduct.GuardianAdLite, None)
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
        case (NationalDelivery, Everyday) => NationalDeliveryEveryday
        case (NationalDelivery, EverydayPlus) => NationalDeliveryEverydayPlus
        case (NationalDelivery, Sixday) => NationalDeliverySixday
        case (NationalDelivery, SixdayPlus) => NationalDeliverySixdayPlus
        case (NationalDelivery, Weekend) => NationalDeliveryWeekend
        case (NationalDelivery, WeekendPlus) => NationalDeliveryWeekendPlus
        case (Collection, Everyday) => VoucherEveryday
        case (Collection, EverydayPlus) => VoucherEverydayPlus
        case (Collection, Sixday) => VoucherSixday
        case (Collection, SixdayPlus) => VoucherSixdayPlus
        case (Collection, Weekend) => VoucherWeekend
        case (Collection, WeekendPlus) => VoucherWeekendPlus
        case (Collection, Saturday) => VoucherSaturday
        case (Collection, SaturdayPlus) => VoucherSaturdayPlus
        case (Collection, Sunday) => VoucherSunday
        case (NoFulfilmentOptions, _) | (_, NoProductOptions) | (Domestic, _) | (RestOfWorld, _) |
            (_, NewspaperArchive) | (NationalDelivery, Saturday) | (NationalDelivery, Sunday) |
            (NationalDelivery, EverydayPlus) | (NationalDelivery, SixdayPlus) | (NationalDelivery, WeekendPlus) |
            (NationalDelivery, SaturdayPlus) =>
          throw new RuntimeException(
            s"Invalid combination of fulfilmentOptions ($fulfilmentOptions) and productOptions ($productOptions)",
          )
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
          s.promoCode,
          Direct,
          Purchase,
          Some(s.accountNumber),
          Some(s.subscriptionNumber),
        )
      case s: SendThankYouEmailTierThreeState =>
        AcquisitionTypeDetails(
          Some(s.paymentMethod),
          s.promoCode,
          Direct,
          Purchase,
          Some(s.accountNumber),
          Some(s.subscriptionNumber),
        )
      case s: SendThankYouEmailDigitalSubscriptionState =>
        AcquisitionTypeDetails(
          Some(s.paymentMethod),
          s.promoCode,
          Direct,
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
      case s: SendThankYouEmailGuardianAdLiteState =>
        AcquisitionTypeDetails(
          paymentMethod = Some(s.paymentMethod),
          promoCode = None,
          readerType = Direct,
          acquisitionType = Purchase,
          zuoraAccountNumber = Some(s.accountNumber),
          zuoraSubscriptionNumber = Some(s.subscriptionNumber),
        )
    }

  private def buildLabels(state: SendAcquisitionEventState) = {
    val referrerLabels = state.acquisitionData.flatMap(_.referrerAcquisitionData.labels).getOrElse(Set())

    Set(
      if (state.analyticsInfo.isGiftPurchase) Some("GIFT_SUBSCRIPTION") else None,
    ).flatten.union(referrerLabels).toList
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
