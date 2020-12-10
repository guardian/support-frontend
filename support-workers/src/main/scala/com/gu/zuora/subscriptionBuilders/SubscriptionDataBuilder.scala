package com.gu.zuora.subscriptionBuilders

import cats.data.EitherT
import cats.implicits._
import com.gu.support.config.{TouchPointEnvironment, ZuoraContributionConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.redemption.{InvalidCode, InvalidReaderType}
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers._
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.workers.states.CreateZuoraSubscriptionState._
import com.gu.support.zuora.api.ReaderType.Gift
import com.gu.support.zuora.api.{ReaderType, SubscriptionData}
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.buildContributionSubscription

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

case class BuildSubscribePromoError(cause: PromoError) extends RuntimeException

case class BuildSubscribeRedemptionError(cause: InvalidCode) extends RuntimeException

class SubscriptionDataBuilder(
  digitalSubscriptionPurchaseBuilder: DigitalSubscriptionPurchaseBuilder,
  digitalSubscriptionCorporateRedemptionBuilder: DigitalSubscriptionCorporateRedemptionBuilder,
  promotionService: PromotionService,
  config: BillingPeriod => ZuoraContributionConfig,
  environment: TouchPointEnvironment,
) {

  def build(
    state: CreateZuoraSubscriptionNewSubscriptionState,
    maybeGeneratedGiftCode: Option[GeneratedGiftCode],
  ): EitherT[Future, Throwable, SubscriptionData] =
    state match {
      case state: CreateZuoraSubscriptionDigitalSubscriptionState =>
        buildDigitalSubscription(state, state.product, environment, maybeGeneratedGiftCode)
      case state: CreateZuoraSubscriptionContributionState =>
        EitherT.pure[Future, Throwable](buildContributionSubscription(state.product, state.requestId, config))
      case state: CreateZuoraSubscriptionPaperState =>
        EitherT.fromEither[Future](PaperSubscriptionBuilder.build(
          state.product,
          state.requestId,
          state.user.billingAddress.country,
          state.promoCode,
          state.firstDeliveryDate,
          promotionService,
          environment
        ).leftMap(BuildSubscribePromoError)
        )
      case state: CreateZuoraSubscriptionGuardianWeeklyState =>
        EitherT.fromEither[Future](GuardianWeeklySubscriptionBuilder.build(
          state.product,
          state.requestId,
          state.user.billingAddress.country,
          state.promoCode,
          state.firstDeliveryDate,
          promotionService,
          if (state.giftRecipient.isDefined) ReaderType.Gift else ReaderType.Direct,
          environment
        ).leftMap(BuildSubscribePromoError)
        )
    }

  private def buildDigitalSubscription(
    state: CreateZuoraSubscriptionDigitalSubscriptionState with CreateZuoraSubscriptionNewSubscriptionState,
    digitalPack: DigitalPack,
    environment: TouchPointEnvironment,
    maybeGeneratedGiftCode: Option[GeneratedGiftCode],
  ): EitherT[Future, Throwable, SubscriptionData] =
    state match {
      case state: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState =>
        EitherT.fromEither[Future](digitalSubscriptionPurchaseBuilder.build(
          state.promoCode,
          state.user.billingAddress.country,
          digitalPack,
          state.requestId,
          environment,
          maybeGeneratedGiftCode,
          None,
        ).leftMap(BuildSubscribePromoError))
      case state: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState =>
        EitherT.fromEither[Future](digitalSubscriptionPurchaseBuilder.build(
          state.promoCode,
          state.user.billingAddress.country,
          digitalPack,
          state.requestId,
          environment,
          maybeGeneratedGiftCode,
          Some(state.giftRecipient.deliveryDate),
        ).leftMap(BuildSubscribePromoError))
      case state: CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState =>
        digitalSubscriptionCorporateRedemptionBuilder.build(
          state.redemptionData,
          digitalPack,
          state.requestId,
          environment,
        ).leftMap(BuildSubscribeRedemptionError)
    }

}
