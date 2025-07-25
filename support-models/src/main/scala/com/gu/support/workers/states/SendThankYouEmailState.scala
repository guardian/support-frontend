package com.gu.support.workers.states

import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.acquisitions.AbTest
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.{Codec, DiscriminatedType}
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import io.circe.{Decoder, Encoder}
import org.joda.time.LocalDate

sealed trait SendThankYouEmailState extends StepFunctionUserState {
  def product: ProductType
  def similarProductsConsent: Option[Boolean]
  def productInformation: Option[ProductInformation]
}

object SendThankYouEmailState {

  case class SendThankYouEmailContributionState(
      user: User,
      product: Contribution,
      productInformation: Option[ProductInformation],
      paymentMethod: PaymentMethod,
      accountNumber: String,
      subscriptionNumber: String,
      similarProductsConsent: Option[Boolean],
  ) extends SendThankYouEmailState

  case class SendThankYouEmailSupporterPlusState(
      user: User,
      product: SupporterPlus,
      productInformation: Option[ProductInformation],
      paymentMethod: PaymentMethod,
      paymentSchedule: PaymentSchedule,
      promoCode: Option[PromoCode],
      accountNumber: String,
      subscriptionNumber: String,
      similarProductsConsent: Option[Boolean],
  ) extends SendThankYouEmailState

  case class SendThankYouEmailTierThreeState(
      user: User,
      product: TierThree,
      productInformation: Option[ProductInformation],
      paymentMethod: PaymentMethod,
      paymentSchedule: PaymentSchedule,
      promoCode: Option[PromoCode],
      accountNumber: String,
      subscriptionNumber: String,
      firstDeliveryDate: LocalDate,
      similarProductsConsent: Option[Boolean],
  ) extends SendThankYouEmailState

  case class SendThankYouEmailGuardianAdLiteState(
      user: User,
      product: GuardianAdLite,
      productInformation: Option[ProductInformation],
      paymentMethod: PaymentMethod,
      paymentSchedule: PaymentSchedule,
      accountNumber: String,
      subscriptionNumber: String,
      similarProductsConsent: Option[Boolean],
  ) extends SendThankYouEmailState

  case class SendThankYouEmailDigitalSubscriptionState(
      user: User,
      product: DigitalPack,
      productInformation: Option[ProductInformation],
      paymentMethod: PaymentMethod,
      paymentSchedule: PaymentSchedule,
      promoCode: Option[PromoCode],
      accountNumber: String,
      subscriptionNumber: String,
      similarProductsConsent: Option[Boolean],
  ) extends SendThankYouEmailState

  case class SendThankYouEmailPaperState(
      user: User,
      product: Paper,
      productInformation: Option[ProductInformation],
      paymentMethod: PaymentMethod,
      paymentSchedule: PaymentSchedule,
      promoCode: Option[PromoCode],
      accountNumber: String,
      subscriptionNumber: String,
      firstDeliveryDate: LocalDate,
      similarProductsConsent: Option[Boolean],
  ) extends SendThankYouEmailState

  case class SendThankYouEmailGuardianWeeklyState(
      user: User,
      product: GuardianWeekly,
      productInformation: Option[ProductInformation],
      giftRecipient: Option[GiftRecipient],
      paymentMethod: PaymentMethod,
      paymentSchedule: PaymentSchedule,
      promoCode: Option[PromoCode],
      accountNumber: String,
      subscriptionNumber: String,
      firstDeliveryDate: LocalDate,
      similarProductsConsent: Option[Boolean],
  ) extends SendThankYouEmailState

  case class TermDates(
      giftStartDate: LocalDate,
      giftEndDate: LocalDate,
      months: Int,
  )

  implicit val codedTermDates: Codec[TermDates] = deriveCodec[TermDates]

  implicit val encodeSFContactId: Encoder[SfContactId] = Encoder.encodeString.contramap[SfContactId](_.id)
  implicit val decodeSFContactId: Decoder[SfContactId] = Decoder.decodeString.map(SfContactId.apply)

  import ExecutionTypeDiscriminators._

  private val discriminatedType = new DiscriminatedType[SendThankYouEmailState](fieldName)
  implicit val codec: Codec[SendThankYouEmailState] = discriminatedType.codec(
    List(
      discriminatedType.variant[SendThankYouEmailContributionState](contribution),
      discriminatedType.variant[SendThankYouEmailSupporterPlusState](supporterPlus),
      discriminatedType.variant[SendThankYouEmailTierThreeState](tierThree),
      discriminatedType.variant[SendThankYouEmailDigitalSubscriptionState](digitalSubscription),
      discriminatedType.variant[SendThankYouEmailPaperState](paper),
      discriminatedType.variant[SendThankYouEmailGuardianWeeklyState](guardianWeekly),
      discriminatedType.variant[SendThankYouEmailGuardianAdLiteState](guardianAdLite),
    ),
  )

}
