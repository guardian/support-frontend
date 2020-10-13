package com.gu.zuora.subscriptionBuilders

import cats.data.EitherT
import cats.implicits._
import com.gu.support.config.{TouchPointEnvironment, ZuoraContributionConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.redemption.{InvalidCode, InvalidReaderType}
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers._
import com.gu.support.workers.states.CreateZuoraSubscriptionState
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
) {

  def build(
    state: CreateZuoraSubscriptionState,
    environment: TouchPointEnvironment,
    maybeGiftRecipWithCode: Option[GiftRecipientAndMaybeCode],
  ): EitherT[Future, Throwable, SubscriptionData] =
    state.product match {
      case c: Contribution => EitherT.pure[Future, Throwable](buildContributionSubscription(c, state.requestId, config))
      case d: DigitalPack =>
        buildDigiSub(state, d, environment, maybeGiftRecipWithCode)
      case p: Paper =>
        EitherT.fromEither[Future](PaperSubscriptionBuilder.build(
          p,
          state.requestId,
          state.user.billingAddress.country,
          state.promoCode,
          state.firstDeliveryDate,
          promotionService,
          environment
        ).leftMap(BuildSubscribePromoError)
        )
      case w: GuardianWeekly =>
        EitherT.fromEither[Future](GuardianWeeklySubscriptionBuilder.build(
          w,
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

  private def buildDigiSub(
    state: CreateZuoraSubscriptionState,
    digitalPack: DigitalPack,
    environment: TouchPointEnvironment,
    maybeGiftRecipWithCode: Option[GiftRecipientAndMaybeCode],
  ): EitherT[Future, Throwable, SubscriptionData]= {
    val Purchase = Left
    val Redemption = Right
    (state.paymentMethod, digitalPack.readerType) match {
      case (Purchase(_: PaymentMethod), _) =>
        EitherT.fromEither[Future](digitalSubscriptionPurchaseBuilder.build(
          state.promoCode,
          state.user.billingAddress.country,
          digitalPack,
          state.requestId,
          environment,
          maybeGiftRecipWithCode.flatMap(_.asDigiSub.map(_.giftCode)),
        ).leftMap(BuildSubscribePromoError))
      case (Redemption(rd: RedemptionData), ReaderType.Corporate) =>
        digitalSubscriptionCorporateRedemptionBuilder.build(rd,
          digitalPack,
          state.requestId,
          environment,
        ).leftMap(BuildSubscribeRedemptionError)
      case (Redemption(_), Gift) =>
        // gift redemptions modify the sub created during the gift purchase
        // this should have been detected earlier
        EitherT.leftT[Future, SubscriptionData](BuildSubscribeRedemptionError(InvalidReaderType))
      case (Redemption(_), _) =>
        // can't redeem other types of sub
        EitherT.leftT[Future, SubscriptionData](BuildSubscribeRedemptionError(InvalidReaderType))
    }
  }
}
