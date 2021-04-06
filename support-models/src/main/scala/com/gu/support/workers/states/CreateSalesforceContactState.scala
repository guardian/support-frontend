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
  ): CreateZuoraSubscriptionWrapperState =
    CreateZuoraSubscriptionWrapperState(CreateZuoraSubscriptionContributionState(
            product,
            purchase,
            salesforceContactRecords.buyer,
          ), requestId, user, product, analyticsInfo, None, None, acquisitionData)

  def toNextDSRedemption(
    product: DigitalPack,
    redemptionData: RedemptionData
  ): CreateZuoraSubscriptionWrapperState =
    CreateZuoraSubscriptionWrapperState(CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState(
            user.id,
            product,
            redemptionData,
          ), requestId, user, product, analyticsInfo, None, None, acquisitionData)

  def toNextDSCorporate(
    salesforceContactRecord: SalesforceContactRecord,
    product: DigitalPack,
    redemptionData: RedemptionData
  ): CreateZuoraSubscriptionWrapperState =
    CreateZuoraSubscriptionWrapperState(CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState(
            product,
            redemptionData,
            salesforceContactRecord,
          ), requestId, user, product, analyticsInfo, None, None, acquisitionData)

  def toNextWeekly(
    salesforceContactRecords: SalesforceContactRecords,
    product: GuardianWeekly,
    purchase: PaymentMethod
  ): CreateZuoraSubscriptionWrapperState =
    CreateZuoraSubscriptionWrapperState(CreateZuoraSubscriptionGuardianWeeklyState(
            user,
            giftRecipient.map(_.asWeekly.get),
            product,
            purchase,
            firstDeliveryDate.get,
            promoCode,
            salesforceContactRecords,
          ), requestId, user, product, analyticsInfo, firstDeliveryDate, promoCode, acquisitionData)

  def toNextPaper(
    salesforceContactRecord: SalesforceContactRecord,
    product: Paper,
    purchase: PaymentMethod
  ): CreateZuoraSubscriptionWrapperState =
    CreateZuoraSubscriptionWrapperState(CreateZuoraSubscriptionPaperState(
            user,
            product,
            purchase,
            firstDeliveryDate.get,
            promoCode,
            salesforceContactRecord,
          ), requestId, user, product, analyticsInfo, firstDeliveryDate, promoCode, acquisitionData)

  def toNextDSGift(
    salesforceContactRecords: SalesforceContactRecords,
    product: DigitalPack,
    purchase: PaymentMethod
  ): CreateZuoraSubscriptionWrapperState =
    CreateZuoraSubscriptionWrapperState(CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState(
            user.billingAddress.country,
            giftRecipient.flatMap(_.asDigitalSubscriptionGiftRecipient).get,
            product,
            purchase,
            promoCode,
            salesforceContactRecords,
          ), requestId, user, product, analyticsInfo, firstDeliveryDate, promoCode, acquisitionData)

  def toNextDSDirect(
    salesforceContactRecord: SalesforceContactRecord,
    product: DigitalPack,
    purchase: PaymentMethod
  ): CreateZuoraSubscriptionWrapperState =
    CreateZuoraSubscriptionWrapperState(CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState(
            user.billingAddress.country,
            product,
            purchase,
            promoCode,
            salesforceContactRecord,
          ), requestId, user, product, analyticsInfo, firstDeliveryDate, promoCode, acquisitionData)

}

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object CreateSalesforceContactState {
  import com.gu.support.encoding.CustomCodecs.decodeEither
  import com.gu.support.encoding.CustomCodecs.encodeEither
  implicit val codec: Codec[CreateSalesforceContactState] = deriveCodec
}
