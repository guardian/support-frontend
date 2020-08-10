package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import cats.data.EitherT
import cats.implicits._
import com.gu.i18n.Country
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{PromoCode, PromoError, PromotionService}
import com.gu.support.redemption.GetCodeStatus
import com.gu.support.redemptions.{CorporateRedemption, RedemptionData}
import com.gu.support.workers.DigitalPack
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api.{ReaderType, Subscription, SubscriptionData}
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCode, buildProductSubscription, validateRatePlan}
import org.joda.time.LocalDate

import scala.concurrent.{ExecutionContext, Future}

sealed trait SubscriptionPaymentType

case class SubscriptionPurchase(
  config: ZuoraDigitalPackConfig,
  maybePromoCode: Option[PromoCode],
  country: Country,
  promotionService: PromotionService
) extends SubscriptionPaymentType

case class SubscriptionRedemption(
  redemptionData: RedemptionData,
  getCodeStatus: GetCodeStatus
) extends SubscriptionPaymentType

object DigitalSubscriptionBuilder {

  def buildPurchase(
    contractEffectiveDate: LocalDate,
    productRatePlanId: ProductRatePlanId,
    requestId: UUID,
    readerType: ReaderType,
    purchase: SubscriptionPurchase
  )(implicit ec: ExecutionContext): EitherT[Future, Either[PromoError, GetCodeStatus.RedemptionInvalid], SubscriptionData] = {
    val delay = if(readerType == Direct)
      purchase.config.defaultFreeTrialPeriod + purchase.config.paymentGracePeriod
    else 0 // Gift purchases don't have a free trial period

    val contractAcceptanceDate = contractEffectiveDate.plusDays(delay)

    val subscriptionData = buildProductSubscription(
      requestId,
      productRatePlanId,
      contractAcceptanceDate = contractAcceptanceDate,
      contractEffectiveDate = contractEffectiveDate,
      readerType = readerType
    )

    EitherT.fromEither[Future](
    applyPromoCode(purchase.promotionService, purchase.maybePromoCode, purchase.country, productRatePlanId, subscriptionData)
      .left.map(Left.apply)
    )
  }

  def buildRedemption(
    contractEffectiveDate: LocalDate,
    productRatePlanId: ProductRatePlanId,
    requestId: UUID,
    readerType: ReaderType,
    redemption: SubscriptionRedemption
  )(implicit ec: ExecutionContext): EitherT[Future, Either[PromoError, GetCodeStatus.RedemptionInvalid], SubscriptionData] = {
    val subscriptionData = buildProductSubscription(
      requestId,
      productRatePlanId,
      contractAcceptanceDate = contractEffectiveDate,
      contractEffectiveDate = contractEffectiveDate,
      readerType = readerType
    )

    redeemCode(subscriptionData.subscription, redemption.redemptionData, redemption.getCodeStatus)
      .map(subscription => subscriptionData.copy(subscription = subscription))
      .leftMap(Right.apply)
  }

  def redeemCode(
    subscription: Subscription,
    redemptionData: RedemptionData,
    getCodeStatus: GetCodeStatus
  )(implicit ec: ExecutionContext): EitherT[Future, GetCodeStatus.RedemptionInvalid, Subscription] = {
    val withCode = subscription.copy(redemptionCode = Some(redemptionData.redemptionCode.value))
    redemptionData match {
      case CorporateRedemption(redemptionCode) =>
        for {
          subscription <-
            EitherT(getCodeStatus(redemptionCode).map(_.map { corporateId =>
              withCode.copy(
                corporateAccountId = Some(corporateId.corporateIdString),
                readerType = ReaderType.Corporate
              )
            }))
        } yield subscription
    }
  }

  def build(
    digitalPack: DigitalPack,
    requestId: UUID,
    subscriptionPaymentType: SubscriptionPaymentType,
    environment: TouchPointEnvironment,
    today: () => LocalDate
  )(implicit ec: ExecutionContext): EitherT[Future, Either[PromoError, GetCodeStatus.RedemptionInvalid], SubscriptionData] = {

    val contractEffectiveDate = today()
    val productRatePlanId = validateRatePlan(digitalPack.productRatePlan(environment, digitalPack.readerType), digitalPack.describe)

    subscriptionPaymentType match {
      case purchase: SubscriptionPurchase =>
        buildPurchase(contractEffectiveDate, productRatePlanId, requestId, digitalPack.readerType, purchase)
      case redemption: SubscriptionRedemption =>
        buildRedemption(contractEffectiveDate, productRatePlanId, requestId, digitalPack.readerType, redemption)
    }

  }

}
