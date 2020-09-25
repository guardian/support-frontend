package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import cats.data.EitherT
import cats.implicits._
import com.gu.i18n.Country
import com.gu.monitoring.SafeLogger
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{PromoCode, PromoError, PromotionService}
import com.gu.support.redemption.corporate.CorporateCodeValidator
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.gifting.generator.CodeBuilder.GiftCode
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.redemption.{InvalidCode, InvalidReaderType, ValidCorporateCode}
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.{BillingPeriod, DigitalPack}
import com.gu.support.zuora.api.ReaderType.{Corporate, Gift}
import com.gu.support.zuora.api.{ReaderType, SubscriptionData}
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, buildProductSubscription, validateRatePlan}
import org.joda.time.LocalDate

import scala.concurrent.{ExecutionContext, Future}

sealed trait SubscriptionPaymentType

case class SubscriptionPurchase(
  config: ZuoraDigitalPackConfig,
  maybePromoCode: Option[PromoCode],
  billingPeriod: BillingPeriod,
  country: Country,
  promotionService: PromotionService
) extends SubscriptionPaymentType

case class SubscriptionRedemption(
  redemptionData: RedemptionData,
  codeValidator: CorporateCodeValidator
) extends SubscriptionPaymentType

object DigitalSubscriptionBuilder {

  type BuildResult = EitherT[Future, Either[PromoError, InvalidCode], SubscriptionData]

  def build(
    digitalPack: DigitalPack,
    requestId: UUID,
    subscriptionPaymentType: SubscriptionPaymentType,
    environment: TouchPointEnvironment,
    giftCodeGenerator: GiftCodeGeneratorService,
    today: () => LocalDate
  )(implicit ec: ExecutionContext): BuildResult = {
    val productRatePlanId = validateRatePlan(digitalPack.productRatePlan(environment, digitalPack.readerType), digitalPack.describe)

    subscriptionPaymentType match {
      case purchase: SubscriptionPurchase =>
        buildPurchase(today(), productRatePlanId, requestId, digitalPack.readerType, purchase, giftCodeGenerator)
      case redemption: SubscriptionRedemption =>
        buildRedemption(today(), productRatePlanId, requestId, digitalPack.readerType, redemption)
    }
  }

  def buildPurchase(
    today: LocalDate,
    productRatePlanId: ProductRatePlanId,
    requestId: UUID,
    readerType: ReaderType,
    purchase: SubscriptionPurchase,
    giftCodeGenerator: GiftCodeGeneratorService
  )(implicit ec: ExecutionContext): BuildResult = {

    val (contractAcceptanceDelay, autoRenew, initialTerm) = if (readerType == Gift)
      (0, false, GiftCodeValidator.expirationTimeInMonths + 1)
    else
      (purchase.config.defaultFreeTrialPeriod + purchase.config.paymentGracePeriod, true, 12)

    val contractAcceptanceDate = today.plusDays(contractAcceptanceDelay)

    val subscriptionData = buildProductSubscription(
      requestId,
      productRatePlanId,
      contractAcceptanceDate = contractAcceptanceDate,
      contractEffectiveDate = today,
      readerType = readerType,
      autoRenew = autoRenew,
      initialTerm = initialTerm
    )

    val withRedemptionCode = addRedemptionCodeIfGift(readerType, giftCodeGenerator.generateCode(purchase.billingPeriod), subscriptionData)
    val withPromoApplied = applyPromoCodeIfPresent(purchase.promotionService, purchase.maybePromoCode, purchase.country, productRatePlanId, withRedemptionCode)

    EitherT.fromEither[Future](withPromoApplied.left.map(Left.apply))
  }

  def addRedemptionCodeIfGift(readerType: ReaderType, giftCode: GiftCode, subscriptionData: SubscriptionData) = {
    if (readerType == Gift) {
      SafeLogger.info(s"Generated code for Digital Subscription gift: ${giftCode.value}")
      subscriptionData.copy(
        subscription = subscriptionData.subscription.copy(redemptionCode = Some(giftCode.value))
      )
    }
    else
      subscriptionData
  }

  def buildRedemption(
    today: LocalDate,
    productRatePlanId: ProductRatePlanId,
    requestId: UUID,
    readerType: ReaderType,
    redemption: SubscriptionRedemption
  )(implicit ec: ExecutionContext): BuildResult = {

    readerType match {
      case Corporate => buildCorporateRedemption(
        today,
        productRatePlanId,
        requestId,
        redemption.redemptionData.redemptionCode,
        redemption.codeValidator
      )
      case _ => val errorType: Either[PromoError, InvalidCode] = Right(InvalidReaderType)
        EitherT.leftT(errorType)
        // Only corporate subscription redemptions require us to create a Zuora subscription,
        // gift redemptions modify the sub created during the gift purchase
    }
  }

  def buildCorporateRedemption(
    today: LocalDate,
    productRatePlanId: ProductRatePlanId,
    requestId: UUID,
    redemptionCode: RedemptionCode,
    codeValidator: CorporateCodeValidator
  )(implicit ec: ExecutionContext): BuildResult = {
    val subscriptionData = buildProductSubscription(
      requestId,
      productRatePlanId,
      contractAcceptanceDate = today,
      contractEffectiveDate = today,
      readerType = Corporate
    )

    val redeemedSubcription = for {
      subscription <-
        EitherT(codeValidator.validate(redemptionCode).map{
          case ValidCorporateCode(corporateId) =>
          Right(subscriptionData.subscription.copy(
            redemptionCode = Some(redemptionCode.value),
            corporateAccountId = Some(corporateId.corporateIdString),
            readerType = ReaderType.Corporate
          ))
          case error: InvalidCode => Left(error)
          case _ => Left(InvalidReaderType)
        })
    } yield subscription

    redeemedSubcription
      .map(subscription => subscriptionData.copy(subscription = subscription))
      .leftMap(Right.apply)
  }

}
