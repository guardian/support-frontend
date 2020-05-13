package com.gu.zuora

import java.util.UUID

import com.gu.i18n.Country
import com.gu.support.catalog
import com.gu.support.catalog.{ProductRatePlan, ProductRatePlanId}
import com.gu.support.config.TouchPointEnvironments.fromStage
import com.gu.support.config.{Stage, ZuoraConfig}
import com.gu.support.promotions.{DefaultPromotions, PromoCode, PromotionService}
import com.gu.support.workers.GuardianWeeklyExtensions._
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers._
import com.gu.support.workers.exceptions.{BadRequestException, CatalogDataNotFoundException}
import com.gu.support.workers.redemption.RedemptionData
import com.gu.support.zuora.api._
import com.gu.zuora.ProductSubscriptionBuilders.allowFixedTermSubs
import org.joda.time.{DateTimeZone, Days, LocalDate}

import scala.util.{Failure, Success, Try}

object ProductSubscriptionBuilders {

  val allowFixedTermSubs = true // TODO: remove this flag once we're live

  def validateRatePlan(maybeProductRatePlan: Option[ProductRatePlan[catalog.Product]], productDescription: String): ProductRatePlanId =
    maybeProductRatePlan.map(_.id) match {
      case Some(value) => value
      case None => throw new CatalogDataNotFoundException(s"RatePlanId not found for $productDescription")
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
      maybeRedemptionData: Option[RedemptionData],
      promotionService: PromotionService,
      stage: Stage,
      isTestUser: Boolean
    ): SubscriptionData = {

      val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)
      val contractAcceptanceDate = contractEffectiveDate
        .plusDays(config.digitalPack.defaultFreeTrialPeriod)
        .plusDays(config.digitalPack.paymentGracePeriod)


      val productRatePlanId = validateRatePlan(digitalPack.productRatePlan(fromStage(stage, isTestUser), fixedTerm = false), digitalPack.describe)

      val subscriptionData = maybeRedeemCode(maybeRedemptionData,
        buildProductSubscription(
          requestId,
          productRatePlanId,
          contractAcceptanceDate = contractAcceptanceDate,
          contractEffectiveDate = contractEffectiveDate
        )
      )

      applyPromoCode(promotionService, maybePromoCode, country, productRatePlanId, subscriptionData)
    }

    def maybeRedeemCode(maybeRedemptionData: Option[RedemptionData], subscriptionData: SubscriptionData): SubscriptionData = {
      val redeemedSub = maybeRedemptionData.map(_.redeem(subscriptionData.subscription)).getOrElse(subscriptionData.subscription)
      subscriptionData.copy(subscription = redeemedSub)
    }
  }

  implicit class PaperSubscriptionBuilder(val paper: Paper) extends ProductSubscriptionBuilder {
    def build(
      requestId: UUID,
      country: Country,
      maybePromoCode: Option[PromoCode],
      firstDeliveryDate: Option[LocalDate],
      promotionService: PromotionService,
      stage: Stage,
      isTestUser: Boolean
    ): SubscriptionData = {

      val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)

      val contractAcceptanceDate = Try(firstDeliveryDate.get) match {
        case Success(value) => value
        case Failure(e) => throw new BadRequestException(s"First delivery date was not provided. It is required for a print subscription.", e)
      }

      val productRatePlanId = validateRatePlan(paper.productRatePlan(fromStage(stage, isTestUser), fixedTerm = false), paper.describe)

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
      stage: Stage,
      isTestUser: Boolean,
      contractEffectiveDate: LocalDate = LocalDate.now(DateTimeZone.UTC)
    ): SubscriptionData = {

      val contractAcceptanceDate = Try(firstDeliveryDate.get) match {
        case Success(value) => value
        case Failure(e) => throw new BadRequestException(s"First delivery date was not provided. It is required for a Guardian Weekly subscription.", e)
      }

      val environment = fromStage(stage, isTestUser)
      val gift = allowFixedTermSubs && readerType == ReaderType.Gift

      val recurringProductRatePlanId = validateRatePlan(guardianWeekly.productRatePlan(environment, fixedTerm = gift), guardianWeekly.describe)

      val promotionProductRatePlanId = if(isIntroductoryPromotion(maybePromoCode)) {
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

    private[this] def isIntroductoryPromotion(maybePromoCode: Option[PromoCode]) =
      maybePromoCode.contains(DefaultPromotions.GuardianWeekly.NonGift.sixForSix) && guardianWeekly.billingPeriod == SixWeekly
  }

}

trait ProductSubscriptionBuilder {

  protected def buildProductSubscription(
    createdRequestId: UUID,
    productRatePlanId: ProductRatePlanId,
    ratePlanCharges: List[RatePlanChargeData] = Nil,
    contractEffectiveDate: LocalDate = LocalDate.now(DateTimeZone.UTC),
    contractAcceptanceDate: LocalDate = LocalDate.now(DateTimeZone.UTC),
    readerType: ReaderType = ReaderType.Direct,
    initialTermMonths: Int = 12
  ) = {
    val (initialTerm, autoRenew, initialTermPeriodType) = if(allowFixedTermSubs && readerType == ReaderType.Gift)
      (initialTermInDays(contractEffectiveDate, contractAcceptanceDate, initialTermMonths), false, Day)
    else
      (12, true, Month)

    SubscriptionData(
      List(
        RatePlanData(
          RatePlan(productRatePlanId),
          ratePlanCharges,
          Nil
        )
      ),
      Subscription(
        contractEffectiveDate = contractEffectiveDate,
        contractAcceptanceDate = contractAcceptanceDate,
        termStartDate = contractEffectiveDate,
        createdRequestId__c = createdRequestId.toString,
        readerType = readerType,
        autoRenew = autoRenew,
        initialTerm = initialTerm,
        initialTermPeriodType = initialTermPeriodType,
      )
    )
  }

  def initialTermInDays(contractEffectiveDate: LocalDate, contractAcceptanceDate: LocalDate, termLengthMonths: Int): Int = {
    val termEnd = contractAcceptanceDate.plusMonths(termLengthMonths)
    Days.daysBetween(contractEffectiveDate, termEnd).getDays
  }

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
