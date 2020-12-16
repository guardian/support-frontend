package com.gu.acquisitions

import com.gu.acquisitions.AcquisitionType.{Purchase, Redemption}
import com.gu.i18n.Country
import com.gu.support.catalog._
import com.gu.support.promotions.{DefaultPromotions, PromoCode}
import com.gu.support.workers.states.SendThankYouEmailState.{SendThankYouEmailContributionState, SendThankYouEmailDigitalSubscriptionCorporateRedemptionState, SendThankYouEmailDigitalSubscriptionDirectPurchaseState, SendThankYouEmailDigitalSubscriptionGiftPurchaseState, SendThankYouEmailDigitalSubscriptionGiftRedemptionState, SendThankYouEmailGuardianWeeklyState, SendThankYouEmailPaperState}
import com.gu.support.workers.states.{SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.support.workers.{AcquisitionData, Annual, BillingPeriod, ClonedDirectDebitPaymentMethod, Contribution, CreditCardReferenceTransaction, DigitalPack, DirectDebitPaymentMethod, GuardianWeekly, Monthly, Paper, PayPalReferenceTransaction, PaymentMethod, ProductType, Quarterly, RequestInfo, SixWeekly, StripePaymentType}
import com.gu.support.zuora.api.ReaderType.{Corporate, Direct, Gift}
import ophan.thrift.event.AbTest
import org.joda.time.format.ISODateTimeFormat
import org.joda.time.{DateTime, DateTimeZone}

import java.util
import scala.collection.JavaConverters._

object AcquisitionTableRowBuilder {
  def buildAcquisitionTableRow(state: SendAcquisitionEventState, requestInfo: RequestInfo): Map[String, Any] = {
    val commonState = state.sendThankYouEmailState
    val (productType, amount) = productTypeAndAmount(commonState)
    val acquisitionTypeDetails = getAcquisitionTypeDetails(commonState)
    val printOptions = printOptionsFromProduct(commonState.product, commonState.user.deliveryAddress.map(_.country))

    val optionalFields = List(
      maybePromoCode(commonState).map("promo_code" -> _),
      acquisitionTypeDetails.paymentProvider.map("payment_provider" -> _),
      printOptions.map("print_options" -> _)
    ).flatten.toMap

    val referrerData = state.acquisitionData.map(getReferrerData).getOrElse(Map[String, String]())

    Map(
      "event_timestamp" -> ISODateTimeFormat.dateTime().print(DateTime.now(DateTimeZone.UTC)),
      "product" -> productType,
      "amount" -> amount,
      "payment_frequency" -> paymentFrequencyFromBillingPeriod(commonState.product.billingPeriod),
      "country_code" -> commonState.user.billingAddress.country.alpha2,
      "currency" -> commonState.product.currency.iso,
      "platform" -> "SUPPORT",
      "identity_id" -> commonState.user.id,
      "labels" -> buildLabels(state, requestInfo.accountExists),
      "reused_existing_payment_method" -> requestInfo.accountExists,
      "acquisition_type" -> acquisitionTypeDetails.acquisitionType,
      "reader_type" -> acquisitionTypeDetails.readerType
    ) ++ referrerData ++ optionalFields

  }

  private def productTypeAndAmount(state: SendThankYouEmailState) = state.product match {
    case c: Contribution => ("RECURRING_CONTRIBUTION", c.amount.toDouble)
    case _: DigitalPack => ("DIGITAL_SUBSCRIPTION", 0D)
    case _: Paper => ("PRINT_SUBSCRIPTION", 0D)
    case _: GuardianWeekly => ("PRINT_SUBSCRIPTION", 0D)
  }

  private def printOptionsFromProduct(product: ProductType, deliveryCountry: Option[Country]): Option[util.Map[PromoCode, String]] = {

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
      case p: Paper => Some(Map(
        "product" -> printProduct(p.fulfilmentOptions, p.productOptions),
        "delivery_country_code" -> "GB"
      ).asJava)
      case _: GuardianWeekly => Some(Map(
        "product" -> "GUARDIAN_WEEKLY",
        "delivery_country_code" -> deliveryCountry.map(_.alpha2).getOrElse("")
      ).asJava)
      case _ => None
    }
  }

  private def paymentFrequencyFromBillingPeriod(billingPeriod: BillingPeriod) =
    billingPeriod match {
      case Monthly => "MONTHLY"
      case Quarterly | SixWeekly => "QUARTERLY"
      case Annual => "ANNUALLY"
    }

  private def getReferrerData(data: AcquisitionData) = {
    val referrerData = data.referrerAcquisitionData
    val abTests = (data.supportAbTests ++ referrerData.abTests.getOrElse(Set[AbTest]()))
      .map(abTest =>
        Map(
          "name" -> abTest.name,
          "variant" -> abTest.variant
        ).asJava).asJava

    val queryParams = referrerData.queryParameters.getOrElse(Set())
      .map(queryParam =>
        Map(
          "key" -> queryParam.name,
          "value" -> queryParam.value
        ).asJava).asJava

    val optionalFields = List(
      data.ophanIds.pageviewId.map("page_view_id" -> _),
      data.ophanIds.browserId.map("browser_id" -> _),
      referrerData.referrerPageviewId.map("referrer_page_view_id" -> _),
      referrerData.referrerUrl.map("referrer_url" -> _),
      referrerData.componentId.map("component_id" -> _),
      referrerData.componentType.map("component_type" -> _.originalName),
      referrerData.source.map("source" -> _.originalName)
    ).flatten.toMap

    Map(
      // Currently only passing through at most one campaign code
      "campaign_codes" -> referrerData.campaignCode.map(List(_)).getOrElse(Nil).asJava,
      "ab_tests" -> abTests,
      "query_parameters" -> queryParams
    ) ++ optionalFields
  }

  private def buildLabels(state: SendAcquisitionEventState, accountExists: Boolean) =
    Set(
      if (accountExists) Some("REUSED_EXISTING_PAYMENT_METHOD") else None,
      if (isSixForSix(state)) Some("GUARDIAN_WEEKLY_SIX_FOR_SIX") else None,
      if (state.analyticsInfo.isGiftPurchase) Some("GIFT_SUBSCRIPTION") else None,
      state.sendThankYouEmailState match {
        case _: SendThankYouEmailDigitalSubscriptionCorporateRedemptionState => Some("CORPORATE_SUBSCRIPTION")
        case _ => None
      }
    ).flatten.toList.asJava

  private def isSixForSix(state: SendAcquisitionEventState) =
    state.sendThankYouEmailState match {
      case s: SendThankYouEmailGuardianWeeklyState =>
        s.product.billingPeriod == SixWeekly && s.promoCode.contains(DefaultPromotions.GuardianWeekly.NonGift.sixForSix)
      case _ => false
    }

  private def getAcquisitionTypeDetails(s: SendThankYouEmailState): AcquisitionTypeDetails = s match {
    case s: SendThankYouEmailContributionState =>
      AcquisitionTypeDetails(
        paymentProviderFromPaymentMethod(s.paymentMethod),
        Direct.value.toUpperCase,
        Purchase.value
      )
    case s: SendThankYouEmailDigitalSubscriptionDirectPurchaseState =>
      AcquisitionTypeDetails(
        paymentProviderFromPaymentMethod(s.paymentMethod),
        Direct.value.toUpperCase,
        Purchase.value
      )
    case s: SendThankYouEmailDigitalSubscriptionGiftPurchaseState =>
      AcquisitionTypeDetails(
        paymentProviderFromPaymentMethod(s.paymentMethod),
        Gift.value.toUpperCase,
        Purchase.value
      )
    case s: SendThankYouEmailPaperState => AcquisitionTypeDetails(
      paymentProviderFromPaymentMethod(s.paymentMethod),
      Direct.value.toUpperCase,
      Purchase.value
    )
    case s: SendThankYouEmailGuardianWeeklyState => AcquisitionTypeDetails(
      paymentProviderFromPaymentMethod(s.paymentMethod),
      (if (s.giftRecipient.isDefined) Gift.value else Direct.value).toUpperCase,
      Purchase.value
    )
    case _: SendThankYouEmailDigitalSubscriptionCorporateRedemptionState => AcquisitionTypeDetails(
      None,
      Corporate.value.toUpperCase,
      Redemption.value
    )
    case _: SendThankYouEmailDigitalSubscriptionGiftRedemptionState => AcquisitionTypeDetails(
      None,
      Gift.value.toUpperCase,
      Redemption.value
    )
  }

  private def paymentProviderFromPaymentMethod(paymentMethod: PaymentMethod): Option[String] =
    Some(paymentMethod match {
      case creditCardPayment: CreditCardReferenceTransaction =>
        creditCardPayment.stripePaymentType match {
          case Some(StripePaymentType.StripeApplePay) => "STRIPE_APPLE_PAY"
          case Some(StripePaymentType.StripePaymentRequestButton) => "STRIPE_PAYMENT_REQUEST_BUTTON"
          case _ => "STRIPE"
        }
      case _: PayPalReferenceTransaction => "PAYPAL"
      case _: DirectDebitPaymentMethod | _: ClonedDirectDebitPaymentMethod => "GOCARDLESS"
    })

  private def maybePromoCode(s: SendThankYouEmailState): Option[PromoCode] = s match {
    case _: SendThankYouEmailContributionState => None
    case s: SendThankYouEmailDigitalSubscriptionDirectPurchaseState => s.promoCode
    case s: SendThankYouEmailDigitalSubscriptionGiftPurchaseState => s.promoCode
    case _: SendThankYouEmailDigitalSubscriptionCorporateRedemptionState => None
    case _: SendThankYouEmailDigitalSubscriptionGiftRedemptionState => None
    case s: SendThankYouEmailPaperState => s.promoCode
    case s: SendThankYouEmailGuardianWeeklyState => s.promoCode
  }

  case class AcquisitionTypeDetails(paymentProvider: Option[String], readerType: String, acquisitionType: String)
}
