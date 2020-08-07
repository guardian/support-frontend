package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import com.gu.i18n.Country
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.promotions.{DefaultPromotions, PromoCode, PromoError, PromotionService}
import com.gu.support.workers.{BillingPeriod, GuardianWeekly, SixWeekly}
import com.gu.support.workers.exceptions.BadRequestException
import com.gu.support.zuora.api.{ReaderType, SubscriptionData}
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCode, buildProductSubscription, validateRatePlan}
import org.joda.time.{DateTimeZone, LocalDate}
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers.GuardianWeeklyExtensions._

import scala.util.{Failure, Success, Try}

object GuardianWeeklySubscriptionBuilder {
  def build(
    guardianWeekly: GuardianWeekly,
    requestId: UUID,
    country: Country,
    maybePromoCode: Option[PromoCode],
    firstDeliveryDate: Option[LocalDate],
    promotionService: PromotionService,
    readerType: ReaderType,
    environment: TouchPointEnvironment,
    contractEffectiveDate: LocalDate = LocalDate.now(DateTimeZone.UTC)
  ): Either[PromoError, SubscriptionData] = {

    val contractAcceptanceDate = Try(firstDeliveryDate.get) match {
      case Success(value) => value
      case Failure(e) => throw new BadRequestException(s"First delivery date was not provided. It is required for a Guardian Weekly subscription.", e)
    }

    val recurringProductRatePlanId = validateRatePlan(guardianWeekly.productRatePlan(environment, readerType), guardianWeekly.describe)

    val promotionProductRatePlanId = if (isIntroductoryPromotion(guardianWeekly.billingPeriod, maybePromoCode)) {
      guardianWeekly.introductoryRatePlan(environment).map(_.id).getOrElse(recurringProductRatePlanId)
    } else recurringProductRatePlanId

    val subscriptionData = buildProductSubscription(
      requestId,
      recurringProductRatePlanId,
      contractAcceptanceDate = contractAcceptanceDate,
      contractEffectiveDate = contractEffectiveDate,
      readerType = readerType,
      initialTermMonths = guardianWeekly.billingPeriod.monthsInPeriod
    )

    applyPromoCode(promotionService, maybePromoCode, country, promotionProductRatePlanId, subscriptionData)
  }

  private[this] def isIntroductoryPromotion(billingPeriod: BillingPeriod, maybePromoCode: Option[PromoCode]) =
    maybePromoCode.contains(DefaultPromotions.GuardianWeekly.NonGift.sixForSix) && billingPeriod == SixWeekly
}
