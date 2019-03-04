package com.gu.zuora

import com.gu.config.Configuration
import com.gu.i18n.Country
import com.gu.monitoring.SafeLogger
import com.gu.support.catalog
import com.gu.support.catalog.{Product, ProductRatePlan, ProductRatePlanId}
import com.gu.support.config.TouchPointEnvironments.UAT
import com.gu.support.config.{TouchPointEnvironments, ZuoraConfig}
import com.gu.support.promotions.{PromoCode, PromotionService}
import com.gu.support.workers.exceptions.{BadRequestException, CatalogDataNotFoundException}
import com.gu.support.workers.{Contribution, DigitalPack, Paper, ProductType}
import com.gu.support.zuora.api._
import org.joda.time.{DateTimeZone, LocalDate}

import scala.util.{Failure, Success, Try}

object ProductSubscriptionBuilders {

  def getProductRatePlanId[PT <: ProductType, P <: Product](product: P, productType: PT, isTestUser: Boolean): ProductRatePlanId = {
    val touchpointEnvironment = if (isTestUser) UAT else TouchPointEnvironments.fromStage(Configuration.stage)

    def getRatePlans[T <: Product](product: T): Seq[ProductRatePlan[Product]] = product.ratePlans.getOrElse(touchpointEnvironment, Nil)

    val ratePlans: Seq[ProductRatePlan[Product]] = getRatePlans(product)

    val maybeProductRatePlanId: Option[ProductRatePlanId] = productType match {
      case dp: DigitalPack => ratePlans.find(rp => rp.billingPeriod == dp.billingPeriod) map (_.id)
      case p: Paper => ratePlans.find(rp => rp.fulfilmentOptions == p.fulfilmentOptions && rp.productOptions == p.productOptions) map (_.id)
    }

    Try(maybeProductRatePlanId.get) match {
      case Success(value) => value
      case Failure(e) => throw new CatalogDataNotFoundException(s"RatePlanId not found for ${productType.toString}", e)
    }
  }

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
    def build(
      config: ZuoraConfig,
      country: Country,
      maybePromoCode: Option[PromoCode],
      promotionService: PromotionService,
      isTestUser: Boolean
    ): SubscriptionData = {

      val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)
      val contractAcceptanceDate = contractEffectiveDate
        .plusDays(config.digitalPack.defaultFreeTrialPeriod)
        .plusDays(config.digitalPack.paymentGracePeriod)

      val productRatePlanId = getProductRatePlanId(catalog.DigitalPack, digitalPack, isTestUser)

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

  implicit class PaperSubscriptionBuilder(val paper: Paper) extends ProductSubscriptionBuilder {
    def build(
      country: Country,
      maybePromoCode: Option[PromoCode],
      firstDeliveryDate: Option[LocalDate],
      promotionService: PromotionService,
      isTestUser: Boolean
    ): SubscriptionData = {

      val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)

      val contractAcceptanceDate = Try(firstDeliveryDate.get) match {
        case Success(value) => value
        case Failure(e) => throw new BadRequestException(s"First delivery date was not provided. It is required for a print subscription.", e)
      }

      val productRatePlanId = getProductRatePlanId(catalog.Paper, paper, isTestUser)

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
