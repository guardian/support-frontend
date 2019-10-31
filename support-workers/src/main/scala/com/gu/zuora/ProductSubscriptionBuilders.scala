package com.gu.zuora

import java.util.UUID

import com.gu.config.Configuration
import com.gu.i18n.Country
import com.gu.support.catalog
import com.gu.support.catalog.{ProductRatePlan, ProductRatePlanId}
import com.gu.support.config.{TouchPointEnvironments, ZuoraConfig}
import com.gu.support.promotions.{PromoCode, PromotionService}
import com.gu.support.workers.GuardianWeeklyExtensions._
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers._
import com.gu.support.workers.exceptions.{BadRequestException, CatalogDataNotFoundException}
import com.gu.support.zuora.api._
import org.joda.time.{DateTimeZone, LocalDate}

import scala.util.{Failure, Success, Try}

object ProductSubscriptionBuilders {

  private def getTouchPointEnvironment(isTestUser: Boolean) = TouchPointEnvironments.fromStage(Configuration.stage, isTestUser)

  def validateRatePlan(maybeProductRatePlan: Option[ProductRatePlan[catalog.Product]], productDescription: String): ProductRatePlanId =
    Try(maybeProductRatePlan.map(_.id).get) match {
      case Success(value) => value
      case Failure(e) => throw new CatalogDataNotFoundException(s"RatePlanId not found for $productDescription", e)
    }

  implicit class ContributionSubscriptionBuilder(val contribution: Contribution) extends ProductSubscriptionBuilder {
    def build(requestId: UUID, config: ZuoraConfig): SubscriptionData = {
      val contributionConfig = config.contributionConfig(contribution.billingPeriod)
      buildProductSubscription(
        requestId,
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
      requestId: UUID,
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


      val productRatePlanId = validateRatePlan(digitalPack.productRatePlan(getTouchPointEnvironment(isTestUser)), digitalPack.describe)

      val subscriptionData = buildProductSubscription(
        requestId,
        productRatePlanId,
        contractAcceptanceDate = contractAcceptanceDate,
        contractEffectiveDate = contractEffectiveDate
      )

      applyPromoCode(promotionService, maybePromoCode, country, productRatePlanId, subscriptionData)
    }
  }

  implicit class PaperSubscriptionBuilder(val paper: Paper) extends ProductSubscriptionBuilder {
    def build(
      requestId: UUID,
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

      val productRatePlanId = validateRatePlan(paper.productRatePlan(getTouchPointEnvironment(isTestUser)), paper.describe)

      val subscriptionData = buildProductSubscription(
        requestId,
        productRatePlanId,
        contractAcceptanceDate = contractAcceptanceDate,
        contractEffectiveDate = contractEffectiveDate,
      )

      applyPromoCode(promotionService, maybePromoCode, country, productRatePlanId, subscriptionData)
    }
  }

  implicit class GuardianWeeklySubscriptionBuilder(val guardianWeekly: GuardianWeekly) extends ProductSubscriptionBuilder {
    def build(
      requestId: UUID,
      country: Country,
      maybePromoCode: Option[PromoCode],
      firstDeliveryDate: Option[LocalDate],
      promotionService: PromotionService,
      readerType: ReaderType,
      isTestUser: Boolean
    ): SubscriptionData = {

      val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)

      val contractAcceptanceDate = Try(firstDeliveryDate.get) match {
        case Success(value) => value
        case Failure(e) => throw new BadRequestException(s"First delivery date was not provided. It is required for a Guardian Weekly subscription.", e)
      }

      val recurringProductRatePlanId = validateRatePlan(guardianWeekly.productRatePlan(getTouchPointEnvironment(isTestUser)), guardianWeekly.describe)

      val promotionProductRatePlanId = if(maybePromoCode.contains(catalog.GuardianWeekly.SixForSixPromoCode) && guardianWeekly.billingPeriod == SixWeekly) {
        guardianWeekly.introductoryRatePlan(getTouchPointEnvironment(isTestUser)).map(_.id).getOrElse(recurringProductRatePlanId)
      } else recurringProductRatePlanId

      val subscriptionData = buildProductSubscription(
        requestId,
        recurringProductRatePlanId,
        contractAcceptanceDate = contractAcceptanceDate,
        contractEffectiveDate = contractEffectiveDate,
        readerType = readerType
      )

      applyPromoCode(promotionService, maybePromoCode, country, promotionProductRatePlanId, subscriptionData)
    }
  }

}

trait ProductSubscriptionBuilder {

  protected def buildProductSubscription(
    createdRequestId: UUID,
    productRatePlanId: ProductRatePlanId,
    ratePlanCharges: List[RatePlanChargeData] = Nil,
    contractEffectiveDate: LocalDate = LocalDate.now(DateTimeZone.UTC),
    contractAcceptanceDate: LocalDate = LocalDate.now(DateTimeZone.UTC),
    readerType: ReaderType = ReaderType.Direct
  ) =
    SubscriptionData(
      List(
        RatePlanData(
          RatePlan(productRatePlanId),
          ratePlanCharges,
          Nil
        )
      ),
      Subscription(contractEffectiveDate, contractAcceptanceDate, contractEffectiveDate, createdRequestId.toString, readerType = readerType)
    )

  protected def applyPromoCode(
    promotionService: PromotionService,
    maybePromoCode: Option[PromoCode],
    country: Country,
    productRatePlanId: ProductRatePlanId,
    subscriptionData: SubscriptionData
  ) = {
    val withPromotion = for {
      promoCode <- maybePromoCode
      promotionWithCode <- promotionService.findPromotion(promoCode)
    } yield promotionService.applyPromotion(promotionWithCode, country, productRatePlanId, subscriptionData, isRenewal = false)

    withPromotion.getOrElse(subscriptionData)
  }
}
