package com.gu.support.workers.states

import com.gu.i18n.Country

import java.util.UUID
import com.gu.salesforce.Salesforce.{SalesforceContactRecords, SfContactId}
import com.gu.support.acquisitions.AcquisitionData
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs.{decodeCountry, decodeLocalTime, encodeCountryAsAlpha2, encodeLocalTime}
import com.gu.support.encoding.{Codec, DiscriminatedType}
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}

case class CreateZuoraSubscriptionState(
  productSpecificState: CreateZuoraSubscriptionProductState,
  requestId: UUID,
  user: User,
  product: ProductType,
  analyticsInfo: AnalyticsInfo,
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  csrUsername: Option[String],
  salesforceCaseId: Option[String],
  acquisitionData: Option[AcquisitionData]
) extends FailureHandlerState

object CreateZuoraSubscriptionState {
  implicit val codec = deriveCodec[CreateZuoraSubscriptionState]
}

sealed trait CreateZuoraSubscriptionProductState

object CreateZuoraSubscriptionProductState {

  case class ContributionState(
    product: Contribution,
    paymentMethod: PaymentMethod,
    salesForceContact: SalesforceContactRecord,
  ) extends CreateZuoraSubscriptionProductState

  case class DigitalSubscriptionDirectPurchaseState(
    billingCountry: Country,
    product: DigitalPack,
    paymentMethod: PaymentMethod,
    promoCode: Option[PromoCode],
    salesForceContact: SalesforceContactRecord,
  ) extends CreateZuoraSubscriptionProductState

  case class DigitalSubscriptionGiftPurchaseState(
    billingCountry: Country,
    giftRecipient: DigitalSubscriptionGiftRecipient,
    product: DigitalPack,
    paymentMethod: PaymentMethod,
    promoCode: Option[PromoCode],
    salesforceContacts: SalesforceContactRecords,
  ) extends CreateZuoraSubscriptionProductState

  case class DigitalSubscriptionCorporateRedemptionState(
    product: DigitalPack,
    redemptionData: RedemptionData,
    salesForceContact: SalesforceContactRecord,
  ) extends CreateZuoraSubscriptionProductState

  case class DigitalSubscriptionGiftRedemptionState(
    userId: String,
    product: DigitalPack,
    redemptionData: RedemptionData,
  ) extends CreateZuoraSubscriptionProductState

  case class PaperState(
    user: User,
    product: Paper,
    paymentMethod: PaymentMethod,
    firstDeliveryDate: LocalDate,
    promoCode: Option[PromoCode],
    salesForceContact: SalesforceContactRecord,
  ) extends CreateZuoraSubscriptionProductState

  case class GuardianWeeklyState(
    user: User,
    giftRecipient: Option[WeeklyGiftRecipient],
    product: GuardianWeekly,
    paymentMethod: PaymentMethod,
    firstDeliveryDate: LocalDate,
    promoCode: Option[PromoCode],
    salesforceContacts: SalesforceContactRecords,
  ) extends CreateZuoraSubscriptionProductState

  import ExecutionTypeDiscriminators._

  private val discriminatedType = new DiscriminatedType[CreateZuoraSubscriptionProductState](fieldName)
  implicit val codec: Codec[CreateZuoraSubscriptionProductState] = discriminatedType.codec(List(
    discriminatedType.variant[ContributionState](contribution),
    discriminatedType.variant[DigitalSubscriptionDirectPurchaseState](digitalSubscriptionDirectPurchase),
    discriminatedType.variant[DigitalSubscriptionGiftPurchaseState](digitalSubscriptionGiftPurchase),
    discriminatedType.variant[DigitalSubscriptionCorporateRedemptionState](digitalSubscriptionCorporateRedemption),
    discriminatedType.variant[DigitalSubscriptionGiftRedemptionState](digitalSubscriptionGiftRedemption),
    discriminatedType.variant[PaperState](paper),
    discriminatedType.variant[GuardianWeeklyState](guardianWeekly),
  ))

}


