package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import cats.data.EitherT
import cats.implicits._
import com.gu.i18n.Country
import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{PromoCode, PromoError, PromotionService}
import com.gu.support.redemption.GetCodeStatus
import com.gu.support.redemptions.{CorporateRedemption, RedemptionData}
import com.gu.support.workers.DigitalPack
import com.gu.support.zuora.api.{ReaderType, Subscription, SubscriptionData}
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCode, buildProductSubscription, validateRatePlan}
import org.joda.time.LocalDate
import com.gu.support.workers.ProductTypeRatePlans._

import scala.concurrent.{ExecutionContext, Future}

sealed trait SubscriptionPaymentType

case class SubscriptionPaymentDirect(
  zuoraDigitalPackConfig: ZuoraDigitalPackConfig,
  maybePromoCode: Option[PromoCode],
  country: Country,
  promotionService: PromotionService
) extends SubscriptionPaymentType

case class SubscriptionPaymentCorporate(
  redemptionData: RedemptionData,
  getCodeStatus: GetCodeStatus
) extends SubscriptionPaymentType

object DigitalSubscriptionBuilder {

  def build(
    digitalPack: DigitalPack,
    requestId: UUID,
    subscriptionPaymentType: SubscriptionPaymentType,
    environment: TouchPointEnvironment,
    today: () => LocalDate
  )(implicit ec: ExecutionContext): EitherT[Future, Either[PromoError, GetCodeStatus.RedemptionInvalid], SubscriptionData] = {

    val contractEffectiveDate = today()
    val delay = subscriptionPaymentType match {
      case direct: SubscriptionPaymentDirect => direct.zuoraDigitalPackConfig.defaultFreeTrialPeriod + direct.zuoraDigitalPackConfig.paymentGracePeriod
      case _: SubscriptionPaymentCorporate => 0
    }
    val contractAcceptanceDate = contractEffectiveDate.plusDays(delay)

    val productRatePlanId = validateRatePlan(digitalPack.productRatePlan(environment, digitalPack.readerType), digitalPack.describe)

    val subscriptionData = buildProductSubscription(
      requestId,
      productRatePlanId,
      contractAcceptanceDate = contractAcceptanceDate,
      contractEffectiveDate = contractEffectiveDate,
      readerType = digitalPack.readerType
    )

    subscriptionPaymentType match {
      case SubscriptionPaymentDirect(_, maybePromoCode, country, promotionService) =>
        EitherT.fromEither[Future](
          applyPromoCode(promotionService, maybePromoCode, country, productRatePlanId, subscriptionData)
            .left.map(Left.apply)
        )
      case SubscriptionPaymentCorporate(redemptionData, getCodeStatus) =>
        withRedemption(subscriptionData.subscription, redemptionData, getCodeStatus)
          .map(subscription => subscriptionData.copy(subscription = subscription))
          .leftMap(Right.apply)
    }

  }

  def withRedemption(
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
}
