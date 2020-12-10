package com.gu.zuora.subscriptionBuilders

import cats.data.EitherT
import cats.implicits._
import com.gu.support.config.{TouchPointEnvironment, ZuoraContributionConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.redemption.InvalidCode
import com.gu.support.workers._
import com.gu.support.workers.states.CreateZuoraSubscriptionState._
import com.gu.support.zuora.api.SubscribeItem
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

  def build(state: CreateZuoraSubscriptionNewSubscriptionState): EitherT[Future, Throwable, SubscribeItem] =
    state match {
      case state: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState =>
        EitherT.fromEither[Future](digitalSubscriptionPurchaseBuilder.build(
          state,
          environment,
        ).leftMap(BuildSubscribePromoError))
      case state: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState =>
        EitherT.fromEither[Future](digitalSubscriptionPurchaseBuilder.build(
          state,
          environment,
        ).leftMap(BuildSubscribePromoError))
      case state: CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState =>
        digitalSubscriptionCorporateRedemptionBuilder.build(
          state,
          environment,
        ).leftMap(BuildSubscribeRedemptionError)
      case state: CreateZuoraSubscriptionContributionState =>
        EitherT.pure[Future, Throwable](buildContributionSubscription(state, config))
      case state: CreateZuoraSubscriptionPaperState =>
        EitherT.fromEither[Future](PaperSubscriptionBuilder.build(
          state,
          promotionService,
          environment
        ).leftMap(BuildSubscribePromoError))
      case state: CreateZuoraSubscriptionGuardianWeeklyState =>
        EitherT.fromEither[Future](GuardianWeeklySubscriptionBuilder.build(
          state,
          promotionService,
          environment
        ).leftMap(BuildSubscribePromoError))
    }

}
