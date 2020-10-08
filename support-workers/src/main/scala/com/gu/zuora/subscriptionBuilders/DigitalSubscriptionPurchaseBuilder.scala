package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import cats.data.EitherT
import cats.implicits._
import com.gu.i18n.Country
import com.gu.monitoring.SafeLogger
import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{PromoCode, PromoError, PromotionService}
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.gifting.generator.CodeBuilder.GiftCode
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.workers.ProductTypeRatePlans.digitalRatePlan
import com.gu.support.workers.{BillingPeriod, DigitalPack}
import com.gu.support.zuora.api.ReaderType.Gift
import com.gu.support.zuora.api.{ReaderType, SubscriptionData}
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, buildProductSubscription, validateRatePlan}
import org.joda.time.LocalDate

import scala.concurrent.{ExecutionContext, Future}

class DigitalSubscriptionPurchaseBuilder(
  config: ZuoraDigitalPackConfig,
  promotionService: PromotionService,
  giftCodeGenerator: GiftCodeGeneratorService,
  today: () => LocalDate,
) {

  import DigitalSubscriptionPurchaseBuilder.addRedemptionCodeIfGift

  def build(
    maybePromoCode: Option[PromoCode],
    billingPeriod: BillingPeriod,
    country: Country,
    digitalPack: DigitalPack,
    requestId: UUID,
    environment: TouchPointEnvironment,
  )(implicit ec: ExecutionContext): EitherT[Future, PromoError, SubscriptionData] = {

    val productRatePlanId = validateRatePlan(digitalRatePlan(digitalPack, environment), digitalPack.describe)
    val (contractAcceptanceDelay, autoRenew, initialTerm) =
      if (digitalPack.readerType == ReaderType.Gift)
        (0, false, GiftCodeValidator.expirationTimeInMonths + 1)
      else
        (config.defaultFreeTrialPeriod + config.paymentGracePeriod, true, 12)

    val todaysDate = today()
    val contractAcceptanceDate = todaysDate.plusDays(contractAcceptanceDelay)

    val subscriptionData = buildProductSubscription(
      requestId,
      productRatePlanId,
      contractAcceptanceDate = contractAcceptanceDate,
      contractEffectiveDate = todaysDate,
      readerType = digitalPack.readerType,
      autoRenew = autoRenew,
      initialTerm = initialTerm
    )

    val withRedemptionCode = addRedemptionCodeIfGift(digitalPack.readerType, giftCodeGenerator.generateCode(billingPeriod), subscriptionData)
    val withPromoApplied = applyPromoCodeIfPresent(promotionService, maybePromoCode, country, productRatePlanId, withRedemptionCode)

    EitherT.fromEither[Future](withPromoApplied)
  }

}

object DigitalSubscriptionPurchaseBuilder {

  private def addRedemptionCodeIfGift(readerType: ReaderType, giftCode: GiftCode, subscriptionData: SubscriptionData) = {
    if (readerType == Gift) {
      SafeLogger.info(s"Generated code for Digital Subscription gift: ${giftCode.value}")
      subscriptionData.copy(
        subscription = subscriptionData.subscription.copy(redemptionCode = Some(giftCode.value)) // TODO needed for thank you email
      )
    }
    else
      subscriptionData
  }

}
