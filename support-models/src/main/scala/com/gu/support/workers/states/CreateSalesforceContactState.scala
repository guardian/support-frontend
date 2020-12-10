package com.gu.support.workers.states

import com.gu.salesforce.Salesforce.SalesforceContactRecords

import java.util.UUID
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{PaymentMethod, User, _}
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.states.CreateZuoraSubscriptionState._

case class CreateSalesforceContactState(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  product: ProductType,
  analyticsInfo: AnalyticsInfo,
  paymentMethod: Either[PaymentMethod, RedemptionData],
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  acquisitionData: Option[AcquisitionData]
) extends FailureHandlerState {

  def toNextContribution(
    salesforceContactRecords: SalesforceContactRecords,
    product: Contribution,
    purchase: PaymentMethod
  ): CreateZuoraSubscriptionContributionState = {
    CreateZuoraSubscriptionContributionState(
      requestId,
      user,
      product,
      analyticsInfo,
      purchase,
      salesforceContactRecords.buyer,
      acquisitionData,
    )
  }

  def toNextDSRedemption(
    product: DigitalPack,
    redemptionData: RedemptionData
  ): CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState = {
    CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState(
      requestId,
      user,
      product,
      analyticsInfo,
      redemptionData,
      acquisitionData,
    )
  }

  def toNextDSCorporate(
    salesforceContactRecord: SalesforceContactRecord,
    product: DigitalPack,
    redemptionData: RedemptionData
  ): CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState =
    CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState(
      requestId,
      user,
      product,
      analyticsInfo,
      redemptionData,
      salesforceContactRecord,
      acquisitionData,
    )

  def toNextWeekly(
    salesforceContactRecords: SalesforceContactRecords,
    product: GuardianWeekly,
    purchase: PaymentMethod
  ): CreateZuoraSubscriptionGuardianWeeklyState =
    CreateZuoraSubscriptionGuardianWeeklyState(
      requestId,
      user,
      giftRecipient.map(_.asWeekly.get),
      product,
      analyticsInfo,
      purchase,
      firstDeliveryDate.get,
      promoCode,
      salesforceContactRecords,
      acquisitionData,
    )

  def toNextPaper(
    salesforceContactRecord: SalesforceContactRecord,
    product: Paper,
    purchase: PaymentMethod
  ): CreateZuoraSubscriptionPaperState =
    CreateZuoraSubscriptionPaperState(
      requestId,
      user,
      product,
      analyticsInfo,
      purchase,
      firstDeliveryDate.get,
      promoCode,
      salesforceContactRecord,
      acquisitionData,
    )

  def toNextDSGift(
    salesforceContactRecords: SalesforceContactRecords,
    product: DigitalPack,
    purchase: PaymentMethod
  ): CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState =
    CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState(
      requestId,
      user,
      giftRecipient.flatMap(_.asDigitalSubscriptionGiftRecipient).get,
      product,
      analyticsInfo,
      purchase,
      promoCode,
      salesforceContactRecords,
      acquisitionData,
    )

  def toNextDSDirect(
    salesforceContactRecord: SalesforceContactRecord,
    product: DigitalPack,
    purchase: PaymentMethod
  ): CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState =
    CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState(
      requestId,
      user,
      product,
      analyticsInfo,
      purchase,
      promoCode,
      salesforceContactRecord,
      acquisitionData,
    )

}

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object CreateSalesforceContactState {
  import com.gu.support.encoding.CustomCodecs.decodeEither
  import com.gu.support.encoding.CustomCodecs.encodeEither
  implicit val codec: Codec[CreateSalesforceContactState] = deriveCodec
}
