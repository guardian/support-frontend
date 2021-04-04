package com.gu.support.workers.states

import com.gu.i18n.Country

import java.util.UUID
import com.gu.salesforce.Salesforce.{SalesforceContactRecords, SfContactId}
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime, decodeCountry, encodeCountryAsAlpha2}
import com.gu.support.encoding.{Codec, DiscriminatedType}
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}

case class CreateZuoraSubscriptionWrapperState(
  productSpecificState: CreateZuoraSubscriptionState,
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  requestId: UUID,
  product: ProductType,
  analyticsInfo: AnalyticsInfo,
  user: User,
  acquisitionData: Option[AcquisitionData],
) extends FailureHandlerState

object CreateZuoraSubscriptionWrapperState {
  implicit val codec = deriveCodec[CreateZuoraSubscriptionWrapperState]
}

sealed trait CreateZuoraSubscriptionState

object CreateZuoraSubscriptionState {

  case class CreateZuoraSubscriptionContributionState(
    product: Contribution,
    paymentMethod: PaymentMethod,
    salesForceContact: SalesforceContactRecord,
  ) extends CreateZuoraSubscriptionState

  case class CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState(
    billingCountry: Country,
    product: DigitalPack,
    paymentMethod: PaymentMethod,
    promoCode: Option[PromoCode],
    salesForceContact: SalesforceContactRecord,
  ) extends CreateZuoraSubscriptionState

  case class CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState(
    billingCountry: Country,
    giftRecipient: DigitalSubscriptionGiftRecipient,
    product: DigitalPack,
    paymentMethod: PaymentMethod,
    promoCode: Option[PromoCode],
    salesforceContacts: SalesforceContactRecords,
  ) extends CreateZuoraSubscriptionState

  case class CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState(
    product: DigitalPack,
    redemptionData: RedemptionData,
    salesForceContact: SalesforceContactRecord,
  ) extends CreateZuoraSubscriptionState

  case class CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState(
    userId: String,
    product: DigitalPack,
    redemptionData: RedemptionData,
  ) extends CreateZuoraSubscriptionState

  case class CreateZuoraSubscriptionPaperState(
    user: User,
    product: Paper,
    paymentMethod: PaymentMethod,
    firstDeliveryDate: LocalDate,
    promoCode: Option[PromoCode],
    salesForceContact: SalesforceContactRecord,
  ) extends CreateZuoraSubscriptionState

  case class CreateZuoraSubscriptionGuardianWeeklyState(
    user: User,
    giftRecipient: Option[WeeklyGiftRecipient],
    product: GuardianWeekly,
    paymentMethod: PaymentMethod,
    firstDeliveryDate: LocalDate,
    promoCode: Option[PromoCode],
    salesforceContacts: SalesforceContactRecords,
  ) extends CreateZuoraSubscriptionState

  private val discriminatedType = new DiscriminatedType[CreateZuoraSubscriptionState]("productType")
  implicit val codec: Codec[CreateZuoraSubscriptionState] = discriminatedType.codec(List(
    discriminatedType.variant[CreateZuoraSubscriptionContributionState]("Contribution"),
    discriminatedType.variant[CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState]("DigitalSubscriptionDirectPurchase"),
    discriminatedType.variant[CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState]("DigitalSubscriptionGiftPurchase"),
    discriminatedType.variant[CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState]("DigitalSubscriptionCorporateRedemption"),
    discriminatedType.variant[CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState]("DigitalSubscriptionGiftRedemption"),
    discriminatedType.variant[CreateZuoraSubscriptionPaperState]("Paper"),
    discriminatedType.variant[CreateZuoraSubscriptionGuardianWeeklyState]("GuardianWeekly"),
  ))

}
