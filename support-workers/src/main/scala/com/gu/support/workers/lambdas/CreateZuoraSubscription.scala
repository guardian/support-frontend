package com.gu.support.workers.lambdas

import cats.implicits._
import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog
import com.gu.support.catalog._
import com.gu.support.config.{TouchPointEnvironments, ZuoraConfig}
import com.gu.support.promotions.PromotionService
import com.gu.support.redemption._
import com.gu.support.redemption.corporate._
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers._
import com.gu.support.workers.lambdas.DigitalSubscriptionGiftRedemption.redeemGift
import com.gu.support.workers.states.CreateZuoraSubscriptionState._
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendAcquisitionEventState}
import com.gu.support.zuora.api._
import com.gu.support.zuora.api.response.{Subscription, ZuoraAccountNumber, ZuoraSubscriptionNumber, ZuoraSuccessOrFailureResponse}
import com.gu.support.zuora.domain.DomainSubscription
import com.gu.zuora.subscriptionBuilders._
import com.gu.zuora.{ZuoraGiftService, ZuoraSubscribeService}
import org.joda.time.{DateTime, DateTimeZone, Days, LocalDate}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success}

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
  extends ServicesHandler[CreateZuoraSubscriptionState, SendAcquisitionEventState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {

    val createSubscription = ZuoraSubscriptionCreator(
      () => DateTime.now(DateTimeZone.UTC),
      services.promotionService,
      services.redemptionService,
      services.zuoraService,
      services.giftCodeGenerator,
      services.config.zuoraConfigProvider.get(state.user.isTestUser),
      state.user.isTestUser,
    )

    state match {
      case state: CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState =>
        redeemGift(state.redemptionData, requestInfo, state, services.zuoraGiftService, services.catalogService)
      case state: CreateZuoraSubscriptionNewSubscriptionState =>
        createSubscription.create(state, requestInfo)
    }

  }
}

class ZuoraSubscriptionCreator(
  now: () => DateTime,
  zuoraService: ZuoraSubscribeService,
  subscriptionDataBuilder: SubscriptionDataBuilder,
  corporateCodeStatusUpdater: CorporateCodeStatusUpdater,
  giftCodeGeneratorService: GiftCodeGeneratorService,
) {
  import com.gu.WithLoggingSugar._
  import ZuoraSubscriptionCreator._

  def create(
    state: CreateZuoraSubscriptionNewSubscriptionState,
    requestInfo: RequestInfo,
  ): Future[HandlerResult[SendAcquisitionEventState]] = {
    val maybeGeneratedGiftCode = addDigitalSubscriptionGiftCreationDetails(state)
    for {
      // TODO combine subscriptionDataBuilder and SubscribeItemBuilder
      subscriptionData <- subscriptionDataBuilder.build(state, maybeGeneratedGiftCode).value.map(_.toTry).flatMap(Future.fromTry)
        .withEventualLogging("subscription data")
      subscribeItem = new SubscribeItemBuilder(state, subscriptionData).build
      identityId <- Future.fromTry(IdentityId(state.user.id))
        .withEventualLogging("identity id")
      maybeDomainSubscription <- GetSubscriptionWithCurrentRequestId(zuoraService, state.requestId, identityId, state.product.billingPeriod, now)
        .withEventualLogging("GetSubscriptionWithCurrentRequestId")
      maybePaymentSchedule <- previewIfNeeded(state, subscribeItem).sequence.withEventualLogging("PreviewPaymentSchedule")
      (account, sub, info) <- subscribeIfApplicable(requestInfo, zuoraService, subscribeItem, maybeDomainSubscription)
        .withEventualLogging("subscribe")
      _ <- updateRedemptionCodeIfApplicable(state, corporateCodeStatusUpdater)
        .withEventualLogging("update redemption code")
    } yield HandlerResult(NextState.getEmailState(
      state,
      account,
      sub,
      maybePaymentSchedule,
      maybeGeneratedGiftCode,
      getDigitalSubscriptionLastRedemptionDate(state, () => now().toLocalDate),
    ), info)
  }

  private def previewIfNeeded(state: CreateZuoraSubscriptionNewSubscriptionState, subscribeItem: SubscribeItem) =
    state match {
      case _: CreateZuoraSubscriptionContributionState |
           _: CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState =>
        None
      case _: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState |
           _: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState |
           _: CreateZuoraSubscriptionPaperState |
           _: CreateZuoraSubscriptionGuardianWeeklyState =>
        Some(PreviewPaymentSchedule.preview(subscribeItem, state.product.billingPeriod, zuoraService, checkSingleResponse))
    }

  private def addDigitalSubscriptionGiftCreationDetails(state: CreateZuoraSubscriptionNewSubscriptionState) =
    state match {
      case dsGift: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState =>
        val giftCode = giftCodeGeneratorService.generateCode(dsGift.product.billingPeriod)
          .withLogging("Generated code for Digital Subscription gift")
        Some(giftCode)
      case _ =>
        None
    }

  private def getDigitalSubscriptionLastRedemptionDate(state: CreateZuoraSubscriptionNewSubscriptionState, today: () => LocalDate) =
    state match {
      case _: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState =>
        Some(today().plusMonths(GiftCodeValidator.expirationTimeInMonths).minusDays(1))
      case _ => None
    }

}

object ZuoraSubscriptionCreator {

  def apply(
    now: () => DateTime,
    promotionService: PromotionService,
    redemptionService: DynamoLookup with DynamoUpdate,
    zuoraService: ZuoraSubscribeService,
    giftCodeGenerator: GiftCodeGeneratorService,
    config: ZuoraConfig,
    isTestUser: Boolean,
  ): ZuoraSubscriptionCreator =
    new ZuoraSubscriptionCreator(
      now,
      zuoraService,
      new SubscriptionDataBuilder(
        new DigitalSubscriptionPurchaseBuilder(config.digitalPack, promotionService, () => now().toLocalDate),
        new DigitalSubscriptionCorporateRedemptionBuilder(
          CorporateCodeValidator.withDynamoLookup(redemptionService),
          () => now().toLocalDate
        ),
        promotionService,
        config.contributionConfig,
        TouchPointEnvironments.fromStage(Configuration.stage, isTestUser),
      ),
      CorporateCodeStatusUpdater.withDynamoUpdate(redemptionService),
      giftCodeGenerator
    )

  def subscribeIfApplicable(
    requestInfo: RequestInfo,
    zuoraService: ZuoraSubscribeService,
    subscribeItem: SubscribeItem,
    maybeDomainSubscription: Option[DomainSubscription]
  ): Future[(ZuoraAccountNumber, ZuoraSubscriptionNumber, RequestInfo)] =
    maybeDomainSubscription match {
      case Some(domainSubscription) =>
        val message = "Skipping subscribe for user because a subscription has already been created for this request"
        SafeLogger.info(message)
        Future.successful((domainSubscription.accountNumber, domainSubscription.subscriptionNumber, requestInfo.appendMessage(message)))
      case None => checkSingleResponse(zuoraService.subscribe(SubscribeRequest(List(subscribeItem)))).map { response =>
        (response.domainAccountNumber, response.domainSubscriptionNumber, requestInfo)
      }
    }

  def checkSingleResponse[ResponseItem](response: Future[List[ResponseItem]]): Future[ResponseItem] = {
    response.flatMap {
      case result :: Nil => Future.successful(result)
      case results => Future.failed(new RuntimeException(s"didn't get a single response item, got: $results"))
    }
  }

  def updateRedemptionCodeIfApplicable(
    state: CreateZuoraSubscriptionNewSubscriptionState,
    corporateCodeStatusUpdater: CorporateCodeStatusUpdater
  ): Future[Unit] =
    state match {
      case state: CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState =>
        corporateCodeStatusUpdater.setStatus(
          state.redemptionData.redemptionCode,
          RedemptionTable.AvailableField.CodeIsUsed
        )
      case _ => Future.successful(())
    }

}

object NextState {

  // scalastyle:off cyclomatic.complexity
  def getEmailState(
    state: CreateZuoraSubscriptionNewSubscriptionState,
    accountNumber: ZuoraAccountNumber,
    subscriptionNumber: ZuoraSubscriptionNumber,
    paymentSchedule: Option[PaymentSchedule],
    maybeGeneratedGiftCode: Option[GeneratedGiftCode],
    maybeLastRedemptionDate: Option[LocalDate],
  ): SendAcquisitionEventState =
    (state, paymentSchedule, maybeGeneratedGiftCode, maybeLastRedemptionDate) match {
      case (state: CreateZuoraSubscriptionContributionState, None, None, None) =>
        state.nextState(accountNumber)
      case (state: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState, Some(paymentSchedule), None, None) =>
        state.nextState(paymentSchedule, accountNumber, subscriptionNumber)
      case (state: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState, Some(paymentSchedule), Some(giftCode), Some(lastRedemptionDate)) =>
        state.nextState(paymentSchedule, giftCode, lastRedemptionDate, accountNumber)
      case (state: CreateZuoraSubscriptionPaperState, Some(paymentSchedule), None, None) =>
        state.nextState(paymentSchedule, accountNumber, subscriptionNumber)
      case (state: CreateZuoraSubscriptionGuardianWeeklyState, Some(paymentSchedule), None, None) =>
        state.nextState(paymentSchedule, accountNumber, subscriptionNumber)
      case (state: CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState, None, None, None) =>
        state.nextState(subscriptionNumber)
      case _ => throw new RuntimeException("could not create value state")
    }
  // scalastyle:on cyclomatic.complexity

}

object DigitalSubscriptionGiftRedemption {

  def redeemGift(
    redemptionData: RedemptionData,
    requestInfo: RequestInfo,
    state: CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState,
    zuoraService: ZuoraGiftService,
    catalogService: CatalogService
  ): Future[HandlerResult[SendAcquisitionEventState]] = {
    val codeValidator = new GiftCodeValidator(zuoraService)
    val zuoraUpdater = new ZuoraUpdater(zuoraService, catalogService)
    for {
      codeValidation <- codeValidator.getStatus(redemptionData.redemptionCode, Some(state.requestId.toString))
      termDates <- codeValidation match {
        case ValidGiftCode(subscriptionId) => zuoraUpdater.doZuoraUpdates(
          subscriptionId,
          zuoraService.updateSubscriptionRedemptionData(subscriptionId, state.requestId.toString, state.user.id, LocalDate.now(), _),
        )
        case CodeRedeemedInThisRequest(subscriptionId) => zuoraUpdater.doZuoraUpdates(
          subscriptionId,
          (_: Int) => Future.successful(ZuoraSuccessOrFailureResponse(success = true, None)),
        )
        case otherState: CodeStatus => Future.failed(new RuntimeException(otherState.clientCode))
      }
      handlerResult <- Future.fromTry(buildHandlerResult(state, requestInfo, termDates))
    } yield handlerResult
  }

  private def buildHandlerResult(
    state: CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState,
    requestInfo: RequestInfo,
    termDates: TermDates,
  ) = Success(HandlerResult(state.nextState(termDates), requestInfo))

  class ZuoraUpdater(
    zuoraService: ZuoraGiftService,
    catalogService: CatalogService
  ){
    def doZuoraUpdates(
      subscriptionId: String,
      updateGiftIdentityIdCall: Int => Future[ZuoraSuccessOrFailureResponse]
    ): Future[TermDates] = for {
      fullGiftSubscription <- zuoraService.getSubscriptionById(subscriptionId)
      calculatedDates <- Future.fromTry(calculateNewTermLength(fullGiftSubscription, catalogService))
      (dates, newTermLength) = calculatedDates
      _ <- updateGiftIdentityIdCall(newTermLength)
      _ <- zuoraService.setupRevenueRecognition(fullGiftSubscription, dates)
    } yield dates


    private def calculateNewTermLength(subscription: Subscription, catalogService: CatalogService) = {
      (for {
        ratePlan <- subscription.ratePlans.headOption
        productRatePlan <- catalogService.getProductRatePlanFromId(catalog.DigitalPack, ratePlan.productRatePlanId)
      } yield {
        val termDates = getStartEndDates(productRatePlan.billingPeriod.monthsInPeriod)
        val newTermLength = Days.daysBetween(subscription.customerAcceptanceDate, termDates.giftEndDate).getDays + 1 //To avoid having to think about time zones
        Success((termDates, newTermLength))
      }).getOrElse(Failure(new RuntimeException(s"Unable to calculate new term length for subscription ${subscription}")))

    }

    private def getStartEndDates(months: Int) = {
      val startDate = LocalDate.now()
      val newEndDate = startDate
        .toDateTimeAtStartOfDay
        .plusMonths(months)
        .toLocalDate
      TermDates(startDate, newEndDate, months)
    }
  }
}
