package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.encoding.{Codec, DiscriminatedType}
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import org.joda.time.LocalDate

case class SendThankYouEmailState(
  requestId: UUID,
  user: User,
  analyticsInfo: AnalyticsInfo,
  sendThankYouEmailProductState: SendThankYouEmailProductSpecificState,
  salesForceContact: SalesforceContactRecord,
  acquisitionData: Option[AcquisitionData]
) extends SendAcquisitionEventState

sealed trait SendThankYouEmailProductSpecificState {
  def product: ProductType
}

object SendThankYouEmailProductSpecificState {

  sealed trait SendThankYouEmailDigitalSubscriptionState extends SendThankYouEmailProductSpecificState {
    override def product: DigitalPack
  }

  case class ContributionCreated(
    product: Contribution,
    paymentMethod: PaymentMethod,
    paymentSchedule: PaymentSchedule,
    promoCode: Option[PromoCode],
    accountNumber: String,
    subscriptionNumber: String,
  ) extends SendThankYouEmailProductSpecificState

  case class SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
    product: DigitalPack,
    paymentMethod: PaymentMethod,
    paymentSchedule: PaymentSchedule,
    promoCode: Option[PromoCode],
    accountNumber: String,
    subscriptionNumber: String,
  ) extends SendThankYouEmailDigitalSubscriptionState

  case class SendThankYouEmailDigitalSubscriptionGiftPurchaseState(
    product: DigitalPack,
    giftRecipient: DigitalSubscriptionGiftRecipient,
    giftCode: GeneratedGiftCode,
    lastRedemptionDate: LocalDate,
    paymentMethod: PaymentMethod,
    paymentSchedule: PaymentSchedule,
    promoCode: Option[PromoCode],
    accountNumber: String,
    subscriptionNumber: String,
  ) extends SendThankYouEmailDigitalSubscriptionState

  case class SendThankYouEmailDigitalSubscriptionCorporateRedemptionState(
    product: DigitalPack,
    subscriptionNumber: String,
  ) extends SendThankYouEmailDigitalSubscriptionState

  case class SendThankYouEmailDigitalSubscriptionGiftRedemptionState( //tbc
    product: DigitalPack,
  ) extends SendThankYouEmailDigitalSubscriptionState

  case class SendThankYouEmailPaperState(
    product: Paper,
    paymentMethod: PaymentMethod,
    paymentSchedule: PaymentSchedule,
    promoCode: Option[PromoCode],
    accountNumber: String,
    subscriptionNumber: String,
    firstDeliveryDate: LocalDate,
  ) extends SendThankYouEmailProductSpecificState

  case class SendThankYouEmailGuardianWeeklyState(
    product: GuardianWeekly,
    giftRecipient: Option[WeeklyGiftRecipient],
    paymentMethod: PaymentMethod,
    paymentSchedule: PaymentSchedule,
    promoCode: Option[PromoCode],
    accountNumber: String,
    subscriptionNumber: String,
    firstDeliveryDate: LocalDate,
  ) extends SendThankYouEmailProductSpecificState

  private val discriminatedType = new DiscriminatedType[SendThankYouEmailProductSpecificState]("productTypeCreatedType")
  implicit val codec = discriminatedType.codec(List(
    discriminatedType.variant[ContributionCreated]("Contribution"),
    discriminatedType.variant[SendThankYouEmailDigitalSubscriptionDirectPurchaseState]("DigitalSubscriptionDirectPurchase"),
    discriminatedType.variant[SendThankYouEmailDigitalSubscriptionGiftPurchaseState]("DigitalSubscriptionGiftPurchase"),
    discriminatedType.variant[SendThankYouEmailDigitalSubscriptionCorporateRedemptionState]("DigitalSubscriptionCorporateRedemption"),
    discriminatedType.variant[SendThankYouEmailDigitalSubscriptionGiftRedemptionState]("DigitalSubscriptionGiftRedemption"),
    discriminatedType.variant[SendThankYouEmailPaperState]("Paper"),
    discriminatedType.variant[SendThankYouEmailGuardianWeeklyState]("GuardianWeekly"),
  ))

}

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SendThankYouEmailState {
  implicit val codec: Codec[SendThankYouEmailState] = deriveCodec
}
