package com.gu.zuora

import com.gu.support.config.ZuoraConfig
import com.gu.support.workers.model.{Contribution, DigitalPack, ProductType}
import com.gu.zuora.model._
import org.joda.time.{DateTimeZone, LocalDate}

object ProductSubscriptionBuilders {

  implicit class ContributionSubscriptionBuilder(val contribution: Contribution) extends ProductSubscriptionBuilder[Contribution] {
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

  implicit class DigitalPackSubscriptionBuilder(val digitalPack: DigitalPack) extends ProductSubscriptionBuilder[DigitalPack] {
    def build(config: ZuoraConfig): SubscriptionData = {
      val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)
      val contractAcceptanceDate = contractEffectiveDate
        .plusDays(config.digitalPack.defaultFreeTrialPeriod)
        .plusDays(config.digitalPack.paymentGracePeriod)

      buildProductSubscription(
        config.digitalPackRatePlan(digitalPack.billingPeriod),
        contractAcceptanceDate = contractAcceptanceDate,
        contractEffectiveDate = contractEffectiveDate
      )

      SubscriptionData(
        List(
          RatePlanData(
            RatePlan(config.discounts.productRatePlanId),
            List(RatePlanChargeData(
              DiscountRatePlanCharge(
                config.discounts.productRatePlanChargeId,
                discountPercentage = 15,
                upToPeriods = 2
              )
            )),
            Nil
          ),
          RatePlanData(
            RatePlan(config.digitalPackRatePlan(digitalPack.billingPeriod)),
            Nil,
            Nil
          )
        ),
        Subscription(contractEffectiveDate, contractAcceptanceDate, contractEffectiveDate)
      )
    }

  }

}

trait ProductSubscriptionBuilder[T <: ProductType] {

  def build(config: ZuoraConfig): SubscriptionData

  protected def buildProductSubscription(
    ratePlanId: RatePlanId,
    ratePlanCharges: List[RatePlanChargeData] = Nil,
    contractEffectiveDate: LocalDate = LocalDate.now(DateTimeZone.UTC),
    contractAcceptanceDate: LocalDate = LocalDate.now(DateTimeZone.UTC)
  ) =
    SubscriptionData(
      List(
        RatePlanData(
          RatePlan(ratePlanId),
          ratePlanCharges,
          Nil
        )
      ),
      Subscription(contractEffectiveDate, contractAcceptanceDate, contractEffectiveDate)
    )
}
