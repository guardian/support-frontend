package com.gu.support.workers.states

import java.util.UUID
import com.gu.salesforce.Salesforce.{SalesforceContactRecords, SfContactId}
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import com.gu.support.encoding.{Codec, DiscriminatedType}
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.zuora.api.response.{ZuoraAccountNumber, ZuoraSubscriptionNumber}

case class PassThroughState(
  createZuoraSubscriptionState: CreateZuoraSubscriptionState,
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  requestId: UUID,
  product: ProductType,
  analyticsInfo: AnalyticsInfo,
  user: User,
  acquisitionData: Option[AcquisitionData],
) extends FailureHandlerState {

  def nextStateWrapper(sendThankYouEmailState: SendThankYouEmailState): SendAcquisitionEventState =
    SendAcquisitionEventState(
      requestId = requestId,
      analyticsInfo = analyticsInfo,
      sendThankYouEmailState = sendThankYouEmailState,
      acquisitionData = acquisitionData
    )

}

object PassThroughState {
  implicit val codec = deriveCodec[PassThroughState]
}

sealed trait CreateZuoraSubscriptionState {
  def requestId: UUID
  def user: User
  def product: ProductType
}

object CreateZuoraSubscriptionState {

  sealed trait CreateZuoraSubscriptionDigitalSubscriptionState extends CreateZuoraSubscriptionState {
    override def product: DigitalPack
  }

  sealed trait CreateZuoraSubscriptionNewSubscriptionState extends CreateZuoraSubscriptionState // marker to say we will actually create rather than updating
  sealed trait CreateZuoraSubscriptionDSPurchaseState extends CreateZuoraSubscriptionDigitalSubscriptionState // marker - buy, not redeem

  case class CreateZuoraSubscriptionContributionState(
    requestId: UUID,
    user: User,
    product: Contribution,
    paymentMethod: PaymentMethod,
    salesForceContact: SalesforceContactRecord,
  ) extends CreateZuoraSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState {

    def nextState(accountNumber: ZuoraAccountNumber)  : SendThankYouEmailState =
      SendThankYouEmailContributionState(user, product, paymentMethod, accountNumber.value)

  }

  case class CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState(
    requestId: UUID,
    user: User,
    product: DigitalPack,
    paymentMethod: PaymentMethod,
    promoCode: Option[PromoCode],
    salesForceContact: SalesforceContactRecord,
  ) extends CreateZuoraSubscriptionDigitalSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState with CreateZuoraSubscriptionDSPurchaseState {

    def nextState(
      paymentSchedule: PaymentSchedule,
      accountNumber: ZuoraAccountNumber,
      subscriptionNumber: ZuoraSubscriptionNumber,
    )  : SendThankYouEmailState =
      SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
        user,
        product,
        paymentMethod,
        paymentSchedule,
        promoCode,
        accountNumber.value,
        subscriptionNumber.value
      )

  }

  case class CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState(
    requestId: UUID,
    user: User,
    giftRecipient: DigitalSubscriptionGiftRecipient,
    product: DigitalPack,
    paymentMethod: PaymentMethod,
    promoCode: Option[PromoCode],
    salesforceContacts: SalesforceContactRecords,
  ) extends CreateZuoraSubscriptionDigitalSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState with CreateZuoraSubscriptionDSPurchaseState {

    def nextState(
      paymentSchedule: PaymentSchedule,
      giftCode: GeneratedGiftCode,
      lastRedemptionDate: LocalDate,
      accountNumber: ZuoraAccountNumber,
    )  : SendThankYouEmailState =
      SendThankYouEmailDigitalSubscriptionGiftPurchaseState(
        user,
        SfContactId(salesforceContacts.giftRecipient.get.Id),
        product,
        giftRecipient,
        giftCode,
        lastRedemptionDate,
        paymentMethod,
        paymentSchedule,
        promoCode,
        accountNumber.value,
      )

  }

  case class CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState(
    requestId: UUID,
    user: User,
    product: DigitalPack,
    redemptionData: RedemptionData,
    salesForceContact: SalesforceContactRecord,
  ) extends CreateZuoraSubscriptionDigitalSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState {

    def nextState(subscriptionNumber: ZuoraSubscriptionNumber)  : SendThankYouEmailState =
      SendThankYouEmailDigitalSubscriptionCorporateRedemptionState(user, product, subscriptionNumber.value)

  }

  case class CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState(
    requestId: UUID,
    user: User,
    product: DigitalPack,
    redemptionData: RedemptionData,
  ) extends CreateZuoraSubscriptionDigitalSubscriptionState {

    def nextState(termDates: TermDates)  : SendThankYouEmailState =
      SendThankYouEmailDigitalSubscriptionGiftRedemptionState(user, product, termDates)

  }

  case class CreateZuoraSubscriptionPaperState(
    requestId: UUID,
    user: User,
    product: Paper,
    paymentMethod: PaymentMethod,
    firstDeliveryDate: LocalDate,
    promoCode: Option[PromoCode],
    salesForceContact: SalesforceContactRecord,
  ) extends CreateZuoraSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState {

    def nextState(
      paymentSchedule: PaymentSchedule,
      accountNumber: ZuoraAccountNumber,
      subscriptionNumber: ZuoraSubscriptionNumber,
    )  : SendThankYouEmailState =
      SendThankYouEmailPaperState(
        user,
        product,
        paymentMethod,
        paymentSchedule,
        promoCode,
        accountNumber.value,
        subscriptionNumber.value,
        firstDeliveryDate
      )

  }

  case class CreateZuoraSubscriptionGuardianWeeklyState(
    requestId: UUID,
    user: User,
    giftRecipient: Option[WeeklyGiftRecipient],
    product: GuardianWeekly,
    paymentMethod: PaymentMethod,
    firstDeliveryDate: LocalDate,
    promoCode: Option[PromoCode],
    salesforceContacts: SalesforceContactRecords,
  ) extends CreateZuoraSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState {

    def nextState(
      paymentSchedule: PaymentSchedule,
      accountNumber: ZuoraAccountNumber,
      subscriptionNumber: ZuoraSubscriptionNumber,
    )  : SendThankYouEmailState =
      SendThankYouEmailGuardianWeeklyState(
        user,
        product,
        giftRecipient,
        paymentMethod,
        paymentSchedule,
        promoCode,
        accountNumber.value,
        subscriptionNumber.value,
        firstDeliveryDate
      )

  }

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
