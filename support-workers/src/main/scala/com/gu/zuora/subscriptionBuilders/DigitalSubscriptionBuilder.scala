package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import cats.data.EitherT
import cats.implicits._
import com.gu.i18n.Country
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{PromoCode, PromoError, PromotionService}
import com.gu.support.redemption.GetCodeStatus
import com.gu.support.redemption.GetCodeStatus.{InvalidReaderType, RedemptionInvalid}
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers.DigitalPack
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.zuora.api.ReaderType.{Corporate, Direct, Gift}
import com.gu.support.zuora.api.{ReaderType, SubscriptionData}
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

  type BuildResult = EitherT[Future, Either[PromoError, RedemptionInvalid], SubscriptionData]

  def build(
    digitalPack: DigitalPack,
    requestId: UUID,
    subscriptionPaymentType: SubscriptionPaymentType,
    environment: TouchPointEnvironment,
    today: () => LocalDate
  )(implicit ec: ExecutionContext): BuildResult = {

    val contractEffectiveDate = today()
    val productRatePlanId = validateRatePlan(digitalPack.productRatePlan(environment, digitalPack.readerType), digitalPack.describe)

    subscriptionPaymentType match {
      case purchase: SubscriptionPurchase =>
        buildPurchase(contractEffectiveDate, productRatePlanId, requestId, digitalPack.readerType, purchase)
      case redemption: SubscriptionRedemption =>
        buildRedemption(contractEffectiveDate, productRatePlanId, requestId, digitalPack.readerType, redemption)
    }

  }

  def buildPurchase(
    contractEffectiveDate: LocalDate,
    productRatePlanId: ProductRatePlanId,
    requestId: UUID,
    readerType: ReaderType,
    purchase: SubscriptionPurchase
  )(implicit ec: ExecutionContext): BuildResult = {
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
  )(implicit ec: ExecutionContext): BuildResult = {

    readerType match {
      case Corporate => buildCorporateRedemption(
        contractEffectiveDate,
        productRatePlanId,
        requestId,
        redemption.redemptionData.redemptionCode,
        redemption.getCodeStatus
      )
      case Gift => buildCorporateRedemption( //TODO: gift redemption
        contractEffectiveDate,
        productRatePlanId,
        requestId,
        redemption.redemptionData.redemptionCode,
        redemption.getCodeStatus
      )
      case _ => val errorType: Either[PromoError, RedemptionInvalid] = Right(InvalidReaderType)
        EitherT.leftT(errorType)
    }

  }

  def buildCorporateRedemption(
    contractEffectiveDate: LocalDate,
    productRatePlanId: ProductRatePlanId,
    requestId: UUID,
    redemptionCode: RedemptionCode,
    getCodeStatus: GetCodeStatus
  )(implicit ec: ExecutionContext): BuildResult = {
    val subscriptionData = buildProductSubscription(
      requestId,
      productRatePlanId,
      contractAcceptanceDate = contractEffectiveDate,
      contractEffectiveDate = contractEffectiveDate,
      readerType = Corporate
    )

    val redeemedSubcription = for {
      subscription <-
        EitherT(getCodeStatus(redemptionCode).map(_.map { corporateId =>
          subscriptionData.subscription.copy(
            redemptionCode = Some(redemptionCode.value),
            corporateAccountId = Some(corporateId.corporateIdString),
            readerType = ReaderType.Corporate
          )
        }))
    } yield subscription

    redeemedSubcription
      .map(subscription => subscriptionData.copy(subscription = subscription))
      .leftMap(Right.apply)
  }

  def buildGiftRedemption() = {}

}
