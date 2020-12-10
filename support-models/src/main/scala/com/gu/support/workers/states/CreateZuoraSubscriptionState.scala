package com.gu.support.workers.states

import java.util.UUID
import com.gu.salesforce.Salesforce.{SalesforceContactRecords, SfContactId}
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import com.gu.support.encoding.DiscriminatedType
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.zuora.api.response.{ZuoraAccountNumber, ZuoraSubscriptionNumber}

sealed trait CreateZuoraSubscriptionState extends MinimalFailureHandlerState {
  def product: ProductType
  def acquisitionData: Option[AcquisitionData]
  def nextStateWrapper(sendThankYouEmailState: SendThankYouEmailState): SendAcquisitionEventState =
    SendAcquisitionEventState(
      requestId = requestId,
      analyticsInfo = analyticsInfo,
      sendThankYouEmailState = sendThankYouEmailState,
      acquisitionData = acquisitionData
    )
}

object CreateZuoraSubscriptionState {

  sealed trait CreateZuoraSubscriptionDigitalSubscriptionState extends CreateZuoraSubscriptionState {
    override def product: DigitalPack
  }

  sealed trait CreateZuoraSubscriptionNewSubscriptionState extends CreateZuoraSubscriptionState // marker to say we will actually create rather than updating

  case class CreateZuoraSubscriptionContributionState(
    requestId: UUID,
    user: User,
    product: Contribution,
    analyticsInfo: AnalyticsInfo,
    paymentMethod: PaymentMethod,
    salesForceContact: SalesforceContactRecord,
    acquisitionData: Option[AcquisitionData]
  ) extends CreateZuoraSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState {

    def nextState(accountNumber: ZuoraAccountNumber): SendAcquisitionEventState =
      nextStateWrapper(SendThankYouEmailContributionState(user, product, paymentMethod, accountNumber.value))

  }

  case class CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState(
    requestId: UUID,
    user: User,
    product: DigitalPack,
    analyticsInfo: AnalyticsInfo,
    paymentMethod: PaymentMethod,
    promoCode: Option[PromoCode],
    salesForceContact: SalesforceContactRecord,
    acquisitionData: Option[AcquisitionData]
  ) extends CreateZuoraSubscriptionDigitalSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState {

    def nextState(
      paymentSchedule: PaymentSchedule,
      accountNumber: ZuoraAccountNumber,
      subscriptionNumber: ZuoraSubscriptionNumber,
    ): SendAcquisitionEventState =
      nextStateWrapper(SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
        user,
        product,
        paymentMethod,
        paymentSchedule,
        promoCode,
        accountNumber.value,
        subscriptionNumber.value
      ))

  }

  case class CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState(
    requestId: UUID,
    user: User,
    giftRecipient: DigitalSubscriptionGiftRecipient,
    product: DigitalPack,
    analyticsInfo: AnalyticsInfo,
    paymentMethod: PaymentMethod,
    promoCode: Option[PromoCode],
    salesforceContacts: SalesforceContactRecords,
    acquisitionData: Option[AcquisitionData]
  ) extends CreateZuoraSubscriptionDigitalSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState {

    def nextState(
      paymentSchedule: PaymentSchedule,
      giftCode: GeneratedGiftCode,
      lastRedemptionDate: LocalDate,
      accountNumber: ZuoraAccountNumber,
    ): SendAcquisitionEventState =
      nextStateWrapper(SendThankYouEmailDigitalSubscriptionGiftPurchaseState(
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
      ))

  }

  case class CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState(
    requestId: UUID,
    user: User,
    product: DigitalPack,
    analyticsInfo: AnalyticsInfo,
    redemptionData: RedemptionData,
    salesForceContact: SalesforceContactRecord,
    acquisitionData: Option[AcquisitionData]
  ) extends CreateZuoraSubscriptionDigitalSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState {

    def nextState(subscriptionNumber: ZuoraSubscriptionNumber): SendAcquisitionEventState =
      nextStateWrapper(SendThankYouEmailDigitalSubscriptionCorporateRedemptionState(user, product, subscriptionNumber.value))

  }

  case class CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState(
    requestId: UUID,
    user: User,
    product: DigitalPack,
    analyticsInfo: AnalyticsInfo,
    redemptionData: RedemptionData,
    acquisitionData: Option[AcquisitionData]
  ) extends CreateZuoraSubscriptionDigitalSubscriptionState {

    def nextState(termDates: TermDates): SendAcquisitionEventState =
      nextStateWrapper(SendThankYouEmailDigitalSubscriptionGiftRedemptionState(user, product, termDates))

  }

  case class CreateZuoraSubscriptionPaperState(
    requestId: UUID,
    user: User,
    product: Paper,
    analyticsInfo: AnalyticsInfo,
    paymentMethod: PaymentMethod,
    firstDeliveryDate: LocalDate,
    promoCode: Option[PromoCode],
    salesForceContact: SalesforceContactRecord,
    acquisitionData: Option[AcquisitionData]
  ) extends CreateZuoraSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState {

    def nextState(
      paymentSchedule: PaymentSchedule,
      accountNumber: ZuoraAccountNumber,
      subscriptionNumber: ZuoraSubscriptionNumber,
    ): SendAcquisitionEventState =
      nextStateWrapper(SendThankYouEmailPaperState(
        user,
        product,
        paymentMethod,
        paymentSchedule,
        promoCode,
        accountNumber.value,
        subscriptionNumber.value,
        firstDeliveryDate
      ))

  }

  case class CreateZuoraSubscriptionGuardianWeeklyState(
    requestId: UUID,
    user: User,
    giftRecipient: Option[WeeklyGiftRecipient],
    product: GuardianWeekly,
    analyticsInfo: AnalyticsInfo,
    paymentMethod: PaymentMethod,
    firstDeliveryDate: LocalDate,
    promoCode: Option[PromoCode],
    salesforceContacts: SalesforceContactRecords,
    acquisitionData: Option[AcquisitionData]
  ) extends CreateZuoraSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState {

    def nextState(
      paymentSchedule: PaymentSchedule,
      accountNumber: ZuoraAccountNumber,
      subscriptionNumber: ZuoraSubscriptionNumber,
    ): SendAcquisitionEventState =
      nextStateWrapper(SendThankYouEmailGuardianWeeklyState(
        user,
        product,
        giftRecipient,
        paymentMethod,
        paymentSchedule,
        promoCode,
        accountNumber.value,
        subscriptionNumber.value,
        firstDeliveryDate
      ))

  }

  private val discriminatedType = new DiscriminatedType[CreateZuoraSubscriptionState]("productType")
  implicit val codec = discriminatedType.codec(List(
    discriminatedType.variant[CreateZuoraSubscriptionContributionState]("Contribution"),
    discriminatedType.variant[CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState]("DigitalSubscriptionDirectPurchase"),
    discriminatedType.variant[CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState]("DigitalSubscriptionGiftPurchase"),
    discriminatedType.variant[CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState]("DigitalSubscriptionCorporateRedemption"),
    discriminatedType.variant[CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState]("DigitalSubscriptionGiftRedemption"),
    discriminatedType.variant[CreateZuoraSubscriptionPaperState]("Paper"),
    discriminatedType.variant[CreateZuoraSubscriptionGuardianWeeklyState]("GuardianWeekly"),
  ))

}
