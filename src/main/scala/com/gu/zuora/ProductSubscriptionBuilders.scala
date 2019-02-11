package com.gu.zuora

import com.gu.i18n.Country
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.ZuoraConfig
import com.gu.support.promotions.{PromoCode, PromotionService}
import com.gu.support.workers.{Contribution, DigitalPack}
import com.gu.support.zuora.api._
import org.joda.time.{DateTimeZone, LocalDate}

object ProductSubscriptionBuilders {

  implicit class ContributionSubscriptionBuilder(val contribution: Contribution) extends ProductSubscriptionBuilder {
    def build(config: ZuoraConfig): SubscriptionData = {
      val contributionConfig = config.contributionConfig(contribution.billingPeriod)
      buildProductSubscription(
        contributionConfig.productRatePlanId,
        List(
          RatePlanChargeData(
            ContributionRatePlanCharge(contributionConfig.productRatePlanChargeId, price = contribution.amount) //Pass the amount the user selected into Zuora
          )
        )
      )
    }
  }

  implicit class DigitalPackSubscriptionBuilder(val digitalPack: DigitalPack) extends ProductSubscriptionBuilder {
    def build(config: ZuoraConfig, country: Country, maybePromoCode: Option[PromoCode], promotionService: PromotionService): SubscriptionData = {
      val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)
      val contractAcceptanceDate = contractEffectiveDate
        .plusDays(config.digitalPack.defaultFreeTrialPeriod)
        .plusDays(config.digitalPack.paymentGracePeriod)

      val productRatePlanId = config.digitalPackRatePlan(digitalPack.billingPeriod)

      val subscriptionData = buildProductSubscription(
        productRatePlanId,
        contractAcceptanceDate = contractAcceptanceDate,
        contractEffectiveDate = contractEffectiveDate
      )

      maybePromoCode
        .map(promotionService.applyPromotion(_, country, productRatePlanId, subscriptionData, isRenewal = false))
        .getOrElse(subscriptionData)
    }
  }

}

trait ProductSubscriptionBuilder {

  protected def buildProductSubscription(
    productRatePlanId: ProductRatePlanId,
    ratePlanCharges: List[RatePlanChargeData] = Nil,
    contractEffectiveDate: LocalDate = LocalDate.now(DateTimeZone.UTC),
    contractAcceptanceDate: LocalDate = LocalDate.now(DateTimeZone.UTC)
  ) =
    SubscriptionData(
      List(
        RatePlanData(
          RatePlan(productRatePlanId),
          ratePlanCharges,
          Nil
        )
      ),
      Subscription(contractEffectiveDate, contractAcceptanceDate, contractEffectiveDate)
    )
}
