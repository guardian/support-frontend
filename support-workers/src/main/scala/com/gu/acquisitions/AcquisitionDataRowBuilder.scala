package com.gu.acquisitions

import com.gu.i18n.Country
import com.gu.support.catalog._
import com.gu.support.promotions.{DefaultPromotions, PromoCode}
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.workers.states.{SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.support.workers.{AcquisitionData, ClonedDirectDebitPaymentMethod, Contribution, CreditCardReferenceTransaction, DigitalPack, DirectDebit, DirectDebitPaymentMethod, GuardianWeekly, Paper, PayPal, PayPalReferenceTransaction, PaymentMethod, PaymentProvider, ProductType, RequestInfo, SixWeekly, Stripe, StripeApplePay, StripePaymentRequestButton, StripePaymentType}
import com.gu.support.zuora.api.ReaderType.{Corporate, Direct, Gift}
import org.joda.time.{DateTime, DateTimeZone}
import com.gu.support.acquisitions
import com.gu.support.acquisitions.AcquisitionType.{Purchase, Redemption}
import com.gu.support.acquisitions.PrintProduct._
import com.gu.support.acquisitions.{AcquisitionDataRow, AcquisitionProduct, AcquisitionType, PrintOptions, PrintProduct}
import com.gu.support.zuora.api.ReaderType


object AcquisitionDataRowBuilder {
  def buildAcquisitionDataRow(state: SendAcquisitionEventState, requestInfo: RequestInfo): AcquisitionDataRow = {
    val commonState = state.sendThankYouEmailState
    val (acquisitionProduct, amount) = productTypeAndAmount(commonState.product)
    val acquisitionTypeDetails = getAcquisitionTypeDetails(commonState)
    val printOptions = printOptionsFromProduct(commonState.product, commonState.user.deliveryAddress.map(_.country))

    AcquisitionDataRow(
      DateTime.now(DateTimeZone.UTC),
      acquisitionProduct,
      amount,
      commonState.user.billingAddress.country,
      commonState.product.currency,
      state.acquisitionData.flatMap(_.referrerAcquisitionData.componentId),
      state.acquisitionData.flatMap(_.referrerAcquisitionData.componentType.map(_.originalName)),
      state.acquisitionData.flatMap(_.referrerAcquisitionData.campaignCode),
      state.acquisitionData.flatMap(_.referrerAcquisitionData.source.map(_.originalName)),
      state.acquisitionData.flatMap(_.referrerAcquisitionData.referrerUrl),
      state.acquisitionData.map(getAbTests).getOrElse(Nil),
      commonState.product.billingPeriod,
      acquisitionTypeDetails.paymentMethod.map(paymentProviderFromPaymentMethod),
      printOptions,
      state.acquisitionData.flatMap(_.ophanIds.browserId),
      Some(commonState.user.id),
      state.acquisitionData.flatMap(_.ophanIds.pageviewId),
      state.acquisitionData.flatMap(_.referrerAcquisitionData.referrerPageviewId),
      buildLabels(state, requestInfo.accountExists),
      acquisitionTypeDetails.promoCode,
      requestInfo.accountExists,
      acquisitionTypeDetails.readerType,
      acquisitionTypeDetails.acquisitionType,
      acquisitionTypeDetails.zuoraSubscriptionNumber,
      acquisitionTypeDetails.zuoraAccountNumber,
      None,
      state.acquisitionData.map(getQueryParameters).getOrElse(Nil)

    )
  }

  private def paymentProviderFromPaymentMethod(paymentMethod: PaymentMethod): PaymentProvider =
    paymentMethod match {
      case creditCardPayment: CreditCardReferenceTransaction =>
        creditCardPayment.stripePaymentType match {
          case Some(StripePaymentType.StripeApplePay) => StripeApplePay
          case Some(StripePaymentType.StripePaymentRequestButton) => StripePaymentRequestButton
          case _ => Stripe
        }
      case _: PayPalReferenceTransaction => PayPal
      case _: DirectDebitPaymentMethod | _: ClonedDirectDebitPaymentMethod => DirectDebit
    }

  private def getAbTests(data: AcquisitionData) =
    (data.supportAbTests ++ data.referrerAcquisitionData.abTests.getOrElse(Set()))
      .map(abTest => acquisitions.AbTest(
        abTest.name,
        abTest.variant
      )).toList

//  def buildAcquisitionDataRowOld(state: SendAcquisitionEventState, requestInfo: RequestInfo): AcquisitionDataRow = {
//    val commonState = state.sendThankYouEmailState
//    val (productType, amount) = productTypeAndAmount(commonState)
//    val acquisitionTypeDetails = getAcquisitionTypeDetails(commonState)
//    val printOptions = printOptionsFromProduct(commonState.product, commonState.user.deliveryAddress.map(_.country))
//
//    val optionalFields = List(
//      maybePromoCode(commonState).map("promo_code" -> _),
//      acquisitionTypeDetails.paymentProvider.map("payment_provider" -> _),
//      printOptions.map("print_options" -> _)
//    ).flatten.toMap
//
//    val referrerData = state.acquisitionData.map(getReferrerData).getOrElse(Map[String, String]())
//
//    Map(
//      "event_timestamp" -> ISODateTimeFormat.dateTime().print(DateTime.now(DateTimeZone.UTC)),
//      "product" -> productType,
//      "amount" -> amount,
//      "payment_frequency" -> paymentFrequencyFromBillingPeriod(commonState.product.billingPeriod),
//      "country_code" -> commonState.user.billingAddress.country.alpha2,
//      "currency" -> commonState.product.currency.iso,
//      "platform" -> "SUPPORT",
//      "identity_id" -> commonState.user.id,
//      "labels" -> buildLabels(state, requestInfo.accountExists),
//      "reused_existing_payment_method" -> requestInfo.accountExists,
//      "acquisition_type" -> acquisitionTypeDetails.acquisitionType,
//      "reader_type" -> acquisitionTypeDetails.readerType
//    ) ++ referrerData ++ optionalFields
//
//  }

  private def productTypeAndAmount(product: ProductType): (AcquisitionProduct, Option[BigDecimal]) = product match {
    case c: Contribution => (AcquisitionProduct.RecurringContribution, Some(c.amount.toDouble))
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
      case p: Paper => Some(PrintOptions(
       printProduct(p.fulfilmentOptions, p.productOptions),
        Country.UK
      ))
      case _: GuardianWeekly => Some(PrintOptions(
        PrintProduct.GuardianWeekly,
        deliveryCountry.getOrElse(Country.UK)
      ))
      case _ => None
    }
  }

  private def getAcquisitionTypeDetails(s: SendThankYouEmailState): AcquisitionTypeDetails =
    s match {
      case s: SendThankYouEmailContributionState => AcquisitionTypeDetails(
        Some(s.paymentMethod),
        None,
        Direct,
        Purchase,
        Some(s.accountNumber),
        None //TODO: we should have a sub number for this
      )
      case s: SendThankYouEmailDigitalSubscriptionDirectPurchaseState => AcquisitionTypeDetails(
        Some(s.paymentMethod),
        s.promoCode,
        Direct,
        Purchase,
        Some(s.accountNumber),
        Some(s.subscriptionNumber)
      )
      case s: SendThankYouEmailDigitalSubscriptionGiftPurchaseState => AcquisitionTypeDetails(
        Some(s.paymentMethod),
        s.promoCode,
        Gift,
        Purchase,
        Some(s.accountNumber),
        None //TODO: we should have a sub number for this
      )
      case s: SendThankYouEmailPaperState => AcquisitionTypeDetails(
        Some(s.paymentMethod),
        s.promoCode,
        Direct,
        Purchase,
        Some(s.accountNumber),
        Some(s.subscriptionNumber)
      )
      case s: SendThankYouEmailGuardianWeeklyState => AcquisitionTypeDetails(
        Some(s.paymentMethod),
        s.promoCode,
        if (s.giftRecipient.isDefined) Gift else Direct,
        Purchase,
        Some(s.accountNumber),
        Some(s.subscriptionNumber)
      )
      case _: SendThankYouEmailDigitalSubscriptionCorporateRedemptionState => AcquisitionTypeDetails(
        None,
        None,
        Corporate,
        Redemption,
        None, //Todo we need a customer account id and sub id
        None
      )
      case _: SendThankYouEmailDigitalSubscriptionGiftRedemptionState => AcquisitionTypeDetails(
        None,
        None,
        Gift,
        Redemption,
        None, //Todo we need a customer account id and sub id
        None
      )
    }

//  private def getReferrerData(data: AcquisitionData) = {
//    val referrerData = data.referrerAcquisitionData
//    val abTests = (data.supportAbTests ++ referrerData.abTests.getOrElse(Set[AbTest]()))
//      .map(abTest =>
//        Map(
//          "name" -> abTest.name,
//          "variant" -> abTest.variant
//        ).asJava).asJava
//
//    val queryParams = referrerData.queryParameters.getOrElse(Set())
//      .map(queryParam =>
//        Map(
//          "key" -> queryParam.name,
//          "value" -> queryParam.value
//        ).asJava).asJava
//
//    val optionalFields = List(
//      data.ophanIds.pageviewId.map("page_view_id" -> _),
//      data.ophanIds.browserId.map("browser_id" -> _),
//      referrerData.referrerPageviewId.map("referrer_page_view_id" -> _),
//      referrerData.referrerUrl.map("referrer_url" -> _),
//      referrerData.componentId.map("component_id" -> _),
//      referrerData.componentType.map("component_type" -> _.originalName),
//      referrerData.source.map("source" -> _.originalName)
//    ).flatten.toMap
//
//    Map(
//      // Currently only passing through at most one campaign code
//      "campaign_codes" -> referrerData.campaignCode.map(List(_)).getOrElse(Nil).asJava,
//      "ab_tests" -> abTests,
//      "query_parameters" -> queryParams
//    ) ++ optionalFields
//  }

  private def buildLabels(state: SendAcquisitionEventState, accountExists: Boolean) =
    Set(
      if (accountExists) Some("REUSED_EXISTING_PAYMENT_METHOD") else None,
      if (isSixForSix(state)) Some("GUARDIAN_WEEKLY_SIX_FOR_SIX") else None,
      if (state.analyticsInfo.isGiftPurchase) Some("GIFT_SUBSCRIPTION") else None,
      state.sendThankYouEmailState match {
        case _: SendThankYouEmailDigitalSubscriptionCorporateRedemptionState => Some("CORPORATE_SUBSCRIPTION")
        case _ => None
      }
    ).flatten.toList

  private def isSixForSix(state: SendAcquisitionEventState) =
    state.sendThankYouEmailState match {
      case s: SendThankYouEmailGuardianWeeklyState =>
        s.product.billingPeriod == SixWeekly && s.promoCode.contains(DefaultPromotions.GuardianWeekly.NonGift.sixForSix)
      case _ => false
    }

  private def getQueryParameters(data: AcquisitionData) =
    data.referrerAcquisitionData.queryParameters.getOrElse(Set())
      .map(queryParam => acquisitions.QueryParameter(
        queryParam.name,
        queryParam.value
      )).toList

  case class AcquisitionTypeDetails(
    paymentMethod: Option[PaymentMethod],
    promoCode: Option[PromoCode],
    readerType: ReaderType,
    acquisitionType: AcquisitionType,
    zuoraAccountNumber: Option[String],
    zuoraSubscriptionNumber: Option[String]
  )

}
