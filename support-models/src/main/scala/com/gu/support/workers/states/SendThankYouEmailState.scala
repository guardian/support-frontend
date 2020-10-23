package com.gu.support.workers.states

import com.gu.support.encoding.DiscriminatedType
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import org.joda.time.LocalDate

sealed trait SendThankYouEmailState extends StepFunctionUserState {
  def product: ProductType
}

object SendThankYouEmailState {

  sealed trait SendThankYouEmailDigitalSubscriptionState extends SendThankYouEmailState {
    override def product: DigitalPack
  }

  case class SendThankYouEmailContributionState(
    user: User,
    salesForceContact: SalesforceContactRecord,
    product: Contribution,
    paymentMethod: PaymentMethod,
    accountNumber: String,
  ) extends SendThankYouEmailState

  case class SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
    user: User,
    salesForceContact: SalesforceContactRecord,
    product: DigitalPack,
    paymentMethod: PaymentMethod,
    paymentSchedule: PaymentSchedule,
    promoCode: Option[PromoCode],
    accountNumber: String,
    subscriptionNumber: String,
  ) extends SendThankYouEmailDigitalSubscriptionState

  case class SendThankYouEmailDigitalSubscriptionGiftPurchaseState(
    user: User,
    salesForceContact: SalesforceContactRecord,
    product: DigitalPack,
    giftRecipient: DigitalSubscriptionGiftRecipient,
    giftCode: GeneratedGiftCode,
    lastRedemptionDate: LocalDate,
    paymentMethod: PaymentMethod,
    paymentSchedule: PaymentSchedule,
    accountNumber: String,
  ) extends SendThankYouEmailDigitalSubscriptionState

  case class SendThankYouEmailDigitalSubscriptionCorporateRedemptionState(
    user: User,
    salesForceContact: SalesforceContactRecord,
    product: DigitalPack,
    subscriptionNumber: String,
  ) extends SendThankYouEmailDigitalSubscriptionState

  case class SendThankYouEmailDigitalSubscriptionGiftRedemptionState( //tbc
    user: User,
    salesForceContact: SalesforceContactRecord,
    product: DigitalPack,
  ) extends SendThankYouEmailDigitalSubscriptionState

  case class SendThankYouEmailPaperState(
    user: User,
    salesForceContact: SalesforceContactRecord,
    product: Paper,
    paymentMethod: PaymentMethod,
    paymentSchedule: PaymentSchedule,
    promoCode: Option[PromoCode],
    accountNumber: String,
    subscriptionNumber: String,
    firstDeliveryDate: LocalDate,
  ) extends SendThankYouEmailState

  case class SendThankYouEmailGuardianWeeklyState(
    user: User,
    salesForceContact: SalesforceContactRecord,
    product: GuardianWeekly,
    giftRecipient: Option[WeeklyGiftRecipient],
    paymentMethod: PaymentMethod,
    paymentSchedule: PaymentSchedule,
    promoCode: Option[PromoCode],
    accountNumber: String,
    subscriptionNumber: String,
    firstDeliveryDate: LocalDate,
  ) extends SendThankYouEmailState

  private val discriminatedType = new DiscriminatedType[SendThankYouEmailState]("productType")
  implicit val codec = discriminatedType.codec(List(
    discriminatedType.variant[SendThankYouEmailContributionState]("Contribution"),
    discriminatedType.variant[SendThankYouEmailDigitalSubscriptionDirectPurchaseState]("DigitalSubscriptionDirectPurchase"),
    discriminatedType.variant[SendThankYouEmailDigitalSubscriptionGiftPurchaseState]("DigitalSubscriptionGiftPurchase"),
    discriminatedType.variant[SendThankYouEmailDigitalSubscriptionCorporateRedemptionState]("DigitalSubscriptionCorporateRedemption"),
    discriminatedType.variant[SendThankYouEmailDigitalSubscriptionGiftRedemptionState]("DigitalSubscriptionGiftRedemption"),
    discriminatedType.variant[SendThankYouEmailPaperState]("Paper"),
    discriminatedType.variant[SendThankYouEmailGuardianWeeklyState]("GuardianWeekly"),
  ))

}
