package com.gu.zuora

import java.util.UUID

import cats.data.EitherT
import cats.implicits._
import com.gu.i18n.Country
import com.gu.support.catalog
import com.gu.support.catalog.{ProductRatePlan, ProductRatePlanId}
import com.gu.support.config.{TouchPointEnvironment, ZuoraConfig, ZuoraDigitalPackConfig}
import com.gu.support.promotions.{DefaultPromotions, PromoCode, PromoError, PromotionService}
import com.gu.support.redemption.GetCodeStatus.NoSuchCode
import com.gu.support.redemption.{GetCodeStatus, RedemptionCode}
import com.gu.support.redemptions.{CorporateRedemption, RedemptionData}
import com.gu.support.workers.GuardianWeeklyExtensions._
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers._
import com.gu.support.workers.exceptions.{BadRequestException, CatalogDataNotFoundException}
import com.gu.support.zuora.api._
import org.joda.time.{DateTimeZone, Days, LocalDate}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}

object ProductSubscriptionBuilders {

  def validateRatePlan(maybeProductRatePlan: Option[ProductRatePlan[catalog.Product]], productDescription: String): ProductRatePlanId =
    maybeProductRatePlan.map(_.id) match {
      case Some(value) => value
      case None => throw new CatalogDataNotFoundException(s"RatePlanId not found for $productDescription")
    }

  def buildContributionSubscription(contribution: Contribution, requestId: UUID, config: ZuoraConfig): SubscriptionData = {
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

  object buildDigitalPackSubscription {

    sealed trait SubscriptionPaymentType

    case class SubscriptionPaymentDirect(
      zuoraDigitalPackConfig: ZuoraDigitalPackConfig,
      maybePromoCode: Option[PromoCode],
      country: Country,
      promotionService: PromotionService
    ) extends SubscriptionPaymentType

    case class SubscriptionPaymentCorporate(
      redemptionData: RedemptionData,
      getCodeStatus: GetCodeStatus
    ) extends SubscriptionPaymentType

    def apply(
      digitalPack: DigitalPack,
      requestId: UUID,
      subscriptionPaymentType: SubscriptionPaymentType,
      environment: TouchPointEnvironment,
      now: () => LocalDate
    )(implicit ec: ExecutionContext): EitherT[Future, Either[PromoError, GetCodeStatus.RedemptionInvalid], SubscriptionData] = {

      val contractEffectiveDate = now()
      val delay = subscriptionPaymentType match {
        case direct: SubscriptionPaymentDirect => direct.zuoraDigitalPackConfig.defaultFreeTrialPeriod + direct.zuoraDigitalPackConfig.paymentGracePeriod
        case _: SubscriptionPaymentCorporate => 0
      }
      val contractAcceptanceDate = contractEffectiveDate.plusDays(delay)

      val productRatePlanId = validateRatePlan(digitalPack.productRatePlan(environment, fixedTerm = false), digitalPack.describe)

      val subscriptionData = buildProductSubscription(
        requestId,
        productRatePlanId,
        contractAcceptanceDate = contractAcceptanceDate,
        contractEffectiveDate = contractEffectiveDate
      )

      subscriptionPaymentType match {
        case SubscriptionPaymentDirect(_, maybePromoCode, country, promotionService) =>
          EitherT.fromEither[Future](
            applyPromoCode(promotionService, maybePromoCode, country, productRatePlanId, subscriptionData)
              .left.map(Left.apply)
          )
        case SubscriptionPaymentCorporate(redemptionData, getCodeStatus) =>
          withRedemption(subscriptionData.subscription, redemptionData, getCodeStatus)
            .map(subscription => subscriptionData.copy(subscription = subscription))
            .leftMap(Right.apply)
      }

    }

    def withRedemption(
      subscription: Subscription,
      redemptionData: RedemptionData,
      getCodeStatus: GetCodeStatus
    )(implicit ec: ExecutionContext): EitherT[Future, GetCodeStatus.RedemptionInvalid, Subscription] = {
      val withCode = subscription.copy(redemptionCode = Some(redemptionData.redemptionCode))
      redemptionData match {
        case CorporateRedemption(redemptionCode, _) =>
          for {
            redemptionCode <- EitherT.fromEither[Future](RedemptionCode(redemptionCode)).leftMap(_ => NoSuchCode)
            subscription <-
              EitherT(getCodeStatus(redemptionCode).map(_.map { corporateId =>
                withCode.copy(
                  corporateAccountId = Some(corporateId.corporateIdString /*FIXME use the same corporate id type everywhere*/),
                  readerType = ReaderType.Corporate
                )
              }))
          } yield subscription
      }
    }
  }

  def buildPaperSubscription(
    paper: Paper,
    requestId: UUID,
    country: Country,
    maybePromoCode: Option[PromoCode],
    firstDeliveryDate: Option[LocalDate],
    promotionService: PromotionService,
    environment: TouchPointEnvironment
  ): Either[PromoError, SubscriptionData] = {

    val contractEffectiveDate = LocalDate.now(DateTimeZone.UTC)

    val contractAcceptanceDate = Try(firstDeliveryDate.get) match {
      case Success(value) => value
      case Failure(e) => throw new BadRequestException(s"First delivery date was not provided. It is required for a print subscription.", e)
    }

    val productRatePlanId = validateRatePlan(paper.productRatePlan(environment, fixedTerm = false), paper.describe)

    val subscriptionData = buildProductSubscription(
      requestId,
      productRatePlanId,
      contractAcceptanceDate = contractAcceptanceDate,
      contractEffectiveDate = contractEffectiveDate,
    )

    applyPromoCode(promotionService, maybePromoCode, country, productRatePlanId, subscriptionData)
  }

  object buildGuardianWeeklySubscription {
    def apply(
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

      val gift = readerType == ReaderType.Gift

      val recurringProductRatePlanId = validateRatePlan(guardianWeekly.productRatePlan(environment, fixedTerm = gift), guardianWeekly.describe)

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

  protected def buildProductSubscription(
    createdRequestId: UUID,
    productRatePlanId: ProductRatePlanId,
    ratePlanCharges: List[RatePlanChargeData] = Nil,
    contractEffectiveDate: LocalDate = LocalDate.now(DateTimeZone.UTC),
    contractAcceptanceDate: LocalDate = LocalDate.now(DateTimeZone.UTC),
    readerType: ReaderType = ReaderType.Direct,
    initialTermMonths: Int = 12
  ): SubscriptionData = {
    val (initialTerm, autoRenew, initialTermPeriodType) = if (readerType == ReaderType.Gift)
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
    val withPromotion = maybePromoCode.map { promoCode =>
      for {
        promotionWithCode <- promotionService.findPromotion(promoCode)
        subscriptionWithPromotion <- promotionService.applyPromotion(promotionWithCode, country, productRatePlanId, subscriptionData, isRenewal = false)
      } yield subscriptionWithPromotion
    }

    withPromotion.getOrElse(Right(subscriptionData))
  }

}
