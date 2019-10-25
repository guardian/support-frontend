package com.gu.zuora

import java.util.UUID

import com.gu.i18n.Country
import com.gu.support.catalog
import com.gu.support.catalog.{Product, ProductRatePlan, ProductRatePlanId}
import com.gu.support.config.TouchPointEnvironments.UAT
import com.gu.support.config.{Stage, TouchPointEnvironments, ZuoraConfig}
import com.gu.support.promotions.{PromoCode, PromotionService}
import com.gu.support.workers._
import com.gu.support.workers.exceptions.{BadRequestException, CatalogDataNotFoundException}
import com.gu.support.zuora.api._
import org.joda.time.{DateTimeZone, Days, LocalDate}

import scala.util.{Failure, Success, Try}

object ProductSubscriptionBuilders {

  def getProductRatePlanId[PT <: ProductType, P <: Product](product: P, productType: PT, stage: Stage, isTestUser: Boolean, fixedTerm: Boolean = false): ProductRatePlanId = {
    val touchpointEnvironment = if (isTestUser) UAT else TouchPointEnvironments.fromStage(stage)

    val ratePlans: Seq[ProductRatePlan[Product]] = product.ratePlans.getOrElse(touchpointEnvironment, Nil)

    val maybeProductRatePlanId: Option[ProductRatePlanId] = productType match {
      case c: Contribution => ratePlans.find(rp => rp.billingPeriod == c.billingPeriod).map(_.id)
      case dp: DigitalPack => ratePlans.find(rp => rp.billingPeriod == dp.billingPeriod).map(_.id)
      case p: Paper => ratePlans.find(rp => rp.fulfilmentOptions == p.fulfilmentOptions && rp.productOptions == p.productOptions).map(_.id)
      case gw: GuardianWeekly => ratePlans.find(rp =>
        rp.billingPeriod == gw.billingPeriod &&
        rp.fulfilmentOptions == gw.fulfilmentOptions &&
        rp.fixedTerm == fixedTerm).map(_.id)
      case _ => None
    }

    Try(maybeProductRatePlanId.get) match {
      case Success(value) => value
      case Failure(e) => throw new CatalogDataNotFoundException(s"RatePlanId not found for ${productType.toString}", e)
    }
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
      stage: Stage,
      isTestUser: Boolean
    ): SubscriptionData = {

      val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)
      val contractAcceptanceDate = contractEffectiveDate
        .plusDays(config.digitalPack.defaultFreeTrialPeriod)
        .plusDays(config.digitalPack.paymentGracePeriod)


      val productRatePlanId = getProductRatePlanId(catalog.DigitalPack, digitalPack, stage, isTestUser)

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
      stage: Stage,
      isTestUser: Boolean
    ): SubscriptionData = {

      val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)

      val contractAcceptanceDate = Try(firstDeliveryDate.get) match {
        case Success(value) => value
        case Failure(e) => throw new BadRequestException(s"First delivery date was not provided. It is required for a print subscription.", e)
      }

      val productRatePlanId = getProductRatePlanId(catalog.Paper, paper, stage, isTestUser)

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

      val productRatePlanId = getProductRatePlanId(catalog.GuardianWeekly, guardianWeekly, stage, isTestUser, fixedTerm = readerType == ReaderType.Gift)

      val subscriptionData = buildProductSubscription(
        requestId,
        productRatePlanId,
        contractAcceptanceDate = contractAcceptanceDate,
        contractEffectiveDate = contractEffectiveDate,
        readerType = readerType,
        initialTermMonths = guardianWeekly.billingPeriod.monthsInPeriod
      )

      applyPromoCode(promotionService, maybePromoCode, country, productRatePlanId, subscriptionData)
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
    readerType: ReaderType = ReaderType.Direct,
    initialTermMonths: Int = 12
  ) = {
    val isGift = readerType == ReaderType.Gift
    val (initialTerm, autoRenew, initialTermPeriodType) = if(isGift)
      (initialTermInDays(contractEffectiveDate, contractAcceptanceDate, initialTermMonths), false, "Day")
    else
      (12, true, "Month")

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
