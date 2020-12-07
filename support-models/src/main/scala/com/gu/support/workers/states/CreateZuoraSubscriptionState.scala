package com.gu.support.workers.states

import java.util.UUID

import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import com.gu.support.redemptions.RedemptionData

//OLDOLD
case class CreateZuoraSubscriptionState(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  product: ProductType,
  analyticsInfo: AnalyticsInfo,
  paymentMethod: Either[PaymentMethod, RedemptionData],
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  salesforceContacts: SalesforceContactRecords,
  acquisitionData: Option[AcquisitionData]
) extends FailureHandlerState
//OLDOLD

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object CreateZuoraSubscriptionState {
  import com.gu.support.encoding.CustomCodecs._
  implicit val codec: Codec[CreateZuoraSubscriptionState] = deriveCodec
}

//sealed trait CreateZuoraSubscriptionNewState extends FailureHandlerState {
//  def product: ProductType
//}
//
//object CreateZuoraSubscriptionNewState {
//
//  sealed trait CreateZuoraSubscriptionDigitalSubscriptionState extends CreateZuoraSubscriptionNewState {
//    override def product: DigitalPack
//  }
//
//  case class CreateZuoraSubscriptionContributionState(
//    user: User,
//    salesForceContact: SalesforceContactRecord,
//    product: Contribution,
//    paymentMethod: PaymentMethod,
//    accountNumber: String,
//  ) extends CreateZuoraSubscriptionNewState
//
//  case class CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState(
//    user: User,
//    sfContactId: SfContactId,
//    product: DigitalPack,
//    paymentMethod: PaymentMethod,
//    paymentSchedule: PaymentSchedule,
//    promoCode: Option[PromoCode],
//    accountNumber: String,
//    subscriptionNumber: String,
//  ) extends CreateZuoraSubscriptionDigitalSubscriptionState
//
//  case class CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState(
//    user: User,
//    purchaserSFContactId: SfContactId,
//    recipientSFContactId: SfContactId,
//    product: DigitalPack,
//    giftRecipient: DigitalSubscriptionGiftRecipient,
//    giftCode: GeneratedGiftCode,
//    lastRedemptionDate: LocalDate,
//    paymentMethod: PaymentMethod,
//    paymentSchedule: PaymentSchedule,
//    promoCode: Option[PromoCode],
//    accountNumber: String,
//  ) extends CreateZuoraSubscriptionDigitalSubscriptionState
//
//  case class CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState(
//    user: User,
//    sfContactId: SfContactId,
//    product: DigitalPack,
//    subscriptionNumber: String,
//  ) extends CreateZuoraSubscriptionDigitalSubscriptionState
//
//  case class CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState(
//    user: User,
//    sfContactId: SfContactId,
//    product: DigitalPack,
//    termDates: TermDates,
//  ) extends CreateZuoraSubscriptionDigitalSubscriptionState
//
//  case class CreateZuoraSubscriptionPaperState(
//    user: User,
//    salesForceContact: SalesforceContactRecord,
//    product: Paper,
//    paymentMethod: PaymentMethod,
//    paymentSchedule: PaymentSchedule,
//    promoCode: Option[PromoCode],
//    accountNumber: String,
//    subscriptionNumber: String,
//    firstDeliveryDate: LocalDate,
//  ) extends CreateZuoraSubscriptionNewState
//
//  case class CreateZuoraSubscriptionGuardianWeeklyState(
//    user: User,
//    salesForceContact: SalesforceContactRecord,
//    product: GuardianWeekly,
//    giftRecipient: Option[WeeklyGiftRecipient],
//    paymentMethod: PaymentMethod,
//    paymentSchedule: PaymentSchedule,
//    promoCode: Option[PromoCode],
//    accountNumber: String,
//    subscriptionNumber: String,
//    firstDeliveryDate: LocalDate,
//  ) extends CreateZuoraSubscriptionNewState
//
//}
