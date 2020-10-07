package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import cats.data.EitherT
import cats.implicits._
import com.gu.i18n.Country
import com.gu.monitoring.SafeLogger
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.ZuoraDigitalPackConfig
import com.gu.support.promotions.{PromoCode, PromotionService}
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.gifting.generator.CodeBuilder.GiftCode
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.workers.BillingPeriod
import com.gu.support.zuora.api.ReaderType.Gift
import com.gu.support.zuora.api.{ReaderType, SubscriptionData}
import com.gu.zuora.subscriptionBuilders.DigitalSubscriptionBuilder.BuildResult
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, buildProductSubscription}
import org.joda.time.LocalDate

import scala.concurrent.{ExecutionContext, Future}

class DigitalSubscriptionPurchaseBuilder(
  config: ZuoraDigitalPackConfig,
  promotionService: PromotionService,
  giftCodeGenerator: GiftCodeGeneratorService,
  today: () => LocalDate,
) {

  class WithPurchase(
    maybePromoCode: Option[PromoCode],
    billingPeriod: BillingPeriod,
    country: Country
  ) extends SubscriptionPaymentTypeBuilder {

    import DigitalSubscriptionPurchaseBuilder.addRedemptionCodeIfGift

    def build(
      productRatePlanId: ProductRatePlanId,
      requestId: UUID,
      readerType: ReaderType,
    )(implicit ec: ExecutionContext): BuildResult = {

      val (contractAcceptanceDelay, autoRenew, initialTerm) =
        if (readerType == ReaderType.Gift)
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
        readerType = readerType,
        autoRenew = autoRenew,
        initialTerm = initialTerm
      )

      val withRedemptionCode = addRedemptionCodeIfGift(readerType, giftCodeGenerator.generateCode(billingPeriod), subscriptionData)
      val withPromoApplied = applyPromoCodeIfPresent(promotionService, maybePromoCode, country, productRatePlanId, withRedemptionCode)

      EitherT.fromEither[Future](withPromoApplied.left.map(Left.apply))
    }
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
