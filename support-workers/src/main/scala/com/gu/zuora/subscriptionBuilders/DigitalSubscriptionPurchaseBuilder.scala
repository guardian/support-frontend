package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import com.gu.i18n.Country
import com.gu.support.config.{TouchPointEnvironment, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{PromoCode, PromoError, PromotionService}
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.workers.ProductTypeRatePlans.digitalRatePlan
import com.gu.support.workers.{DigitalPack, GiftCode}
import com.gu.support.zuora.api.ReaderType.Gift
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}
import org.joda.time.LocalDate

import scala.concurrent.ExecutionContext

class DigitalSubscriptionPurchaseBuilder(
  config: ZuoraDigitalPackConfig,
  promotionService: PromotionService,
  today: () => LocalDate,
) {

  def build(
    maybePromoCode: Option[PromoCode],
    country: Country,
    digitalPack: DigitalPack,
    requestId: UUID,
    environment: TouchPointEnvironment,
    maybeGiftCode: Option[GiftCode],
  )(implicit ec: ExecutionContext): Either[PromoError, SubscriptionData] = {

    val productRatePlanId = validateRatePlan(digitalRatePlan(digitalPack, environment), digitalPack.describe)
    val (contractAcceptanceDelay, autoRenew, initialTerm) =
      if (digitalPack.readerType == ReaderType.Gift)
        (0, false, GiftCodeValidator.expirationTimeInMonths + 1)
      else
        (config.defaultFreeTrialPeriod + config.paymentGracePeriod, true, 12)

    val todaysDate = today()
    val contractAcceptanceDate = todaysDate.plusDays(contractAcceptanceDelay)

    val maybeRedemptionCode = (digitalPack.readerType, maybeGiftCode) match {
      case (Gift, Some(giftCode)) => Some(giftCode)
      case (Gift, _) | (_, Some(_)) => None // FIXME coding error - possible unredeemable sub
      case _ => None
    }

    val subscriptionData = SubscriptionData(
      List(RatePlanData(RatePlan(productRatePlanId), Nil, Nil)),
      Subscription(
        contractEffectiveDate = todaysDate,
        contractAcceptanceDate = contractAcceptanceDate,
        termStartDate = todaysDate,
        createdRequestId__c = requestId.toString,
        readerType = digitalPack.readerType,
        autoRenew = autoRenew,
        initialTerm = initialTerm,
        initialTermPeriodType = Month,
        redemptionCode = maybeRedemptionCode.map(_.value)
      )
    )

    applyPromoCodeIfPresent(promotionService, maybePromoCode, country, productRatePlanId, subscriptionData)

  }

}
