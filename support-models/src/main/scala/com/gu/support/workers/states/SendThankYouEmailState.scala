package com.gu.support.workers.states

import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.DiscriminatedType
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import io.circe.{Decoder, Encoder}
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
      product: Contribution,
      paymentMethod: PaymentMethod,
      accountNumber: String,
      subscriptionNumber: String,
  ) extends SendThankYouEmailState

  case class SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
      user: User,
      product: DigitalPack,
      paymentMethod: PaymentMethod,
      paymentSchedule: PaymentSchedule,
      promoCode: Option[PromoCode],
      accountNumber: String,
      subscriptionNumber: String,
  ) extends SendThankYouEmailDigitalSubscriptionState

  case class SendThankYouEmailDigitalSubscriptionGiftPurchaseState(
      user: User,
      recipientSFContactId: SfContactId,
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
      user: User,
      product: DigitalPack,
      accountNumber: String,
      subscriptionNumber: String,
  ) extends SendThankYouEmailDigitalSubscriptionState

  case class SendThankYouEmailDigitalSubscriptionGiftRedemptionState(
      user: User,
      product: DigitalPack,
      subscriptionNumber: String,
      termDates: TermDates,
  ) extends SendThankYouEmailDigitalSubscriptionState

  case class SendThankYouEmailPaperState(
      user: User,
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
      product: GuardianWeekly,
      giftRecipient: Option[WeeklyGiftRecipient],
      paymentMethod: PaymentMethod,
      paymentSchedule: PaymentSchedule,
      promoCode: Option[PromoCode],
      accountNumber: String,
      subscriptionNumber: String,
      firstDeliveryDate: LocalDate,
  ) extends SendThankYouEmailState

  case class TermDates(
      giftStartDate: LocalDate,
      giftEndDate: LocalDate,
      months: Int,
  )

  implicit val codedTermDates = deriveCodec[TermDates]

  implicit val encodeSFContactId = Encoder.encodeString.contramap[SfContactId](_.id)
  implicit val decodeSFContactId = Decoder.decodeString.map(SfContactId.apply)

  import ExecutionTypeDiscriminators._

  private val discriminatedType = new DiscriminatedType[SendThankYouEmailState](fieldName)
  implicit val codec = discriminatedType.codec(
    List(
      discriminatedType.variant[SendThankYouEmailContributionState](contribution),
      discriminatedType.variant[SendThankYouEmailDigitalSubscriptionDirectPurchaseState](
        digitalSubscriptionDirectPurchase,
      ),
      discriminatedType.variant[SendThankYouEmailDigitalSubscriptionGiftPurchaseState](digitalSubscriptionGiftPurchase),
      discriminatedType.variant[SendThankYouEmailDigitalSubscriptionCorporateRedemptionState](
        digitalSubscriptionCorporateRedemption,
      ),
      discriminatedType.variant[SendThankYouEmailDigitalSubscriptionGiftRedemptionState](
        digitalSubscriptionGiftRedemption,
      ),
      discriminatedType.variant[SendThankYouEmailPaperState](paper),
      discriminatedType.variant[SendThankYouEmailGuardianWeeklyState](guardianWeekly),
    ),
  )

}
