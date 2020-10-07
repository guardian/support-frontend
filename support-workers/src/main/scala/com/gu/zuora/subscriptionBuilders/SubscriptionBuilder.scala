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

class SubscriptionBuilder(
  digitalSubscriptionPurchaseBuilder: DigitalSubscriptionPurchaseBuilder,
  digitalSubscriptionCorporateRedemptionBuilder: DigitalSubscriptionCorporateRedemptionBuilder,
  promotionService: => PromotionService,
  config: BillingPeriod => ZuoraContributionConfig,
) {

  def build(
    state: CreateZuoraSubscriptionState,
    environment: TouchPointEnvironment,
  ): EitherT[Future, Throwable, SubscriptionData] =
    state.product match {
      case c: Contribution => EitherT.pure[Future, Throwable](buildContributionSubscription(c, state.requestId, config))
      case d: DigitalPack =>
        DigitalSubscriptionBuilder.build(
          digiSubPaymentTypeBuilder(state, d),
          d,
          state.requestId,
          environment,
        ).leftMap(_.fold(BuildSubscribePromoError, BuildSubscribeRedemptionError): Throwable)
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

  private def digiSubPaymentTypeBuilder(state: CreateZuoraSubscriptionState, d: DigitalPack) = {
    val Purchase = Left
    val Redemption = Right
    (state.paymentMethod, d.readerType) match {
      case (Purchase(_: PaymentMethod), _) =>
        new digitalSubscriptionPurchaseBuilder.WithPurchase(
          state.promoCode,
          state.product.billingPeriod,
          state.user.billingAddress.country
        )
      case (Redemption(rd: RedemptionData), ReaderType.Corporate) =>
        new digitalSubscriptionCorporateRedemptionBuilder.WithRedemption(rd)
      case (Redemption(_), Gift) =>
        // gift redemptions modify the sub created during the gift purchase
        // this should have been detected earlier
        new RedemptionErrorBuilder(InvalidReaderType)
      case (Redemption(_), _) =>
        // can't redeem other types of sub
        new RedemptionErrorBuilder(InvalidReaderType)
    }
  }
}
