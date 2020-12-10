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
import com.gu.support.workers.states.CreateZuoraSubscriptionState._
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.workers.states.{PassThroughState, SendAcquisitionEventState, SendThankYouEmailState}
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
  extends ServicesHandler[PassThroughState, SendAcquisitionEventState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    passThroughState: PassThroughState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {

    val state = passThroughState.createZuoraSubscriptionState

    val createSubscription = ZuoraSubscriptionCreator(
      () => DateTime.now(DateTimeZone.UTC),
      services.promotionService,
      services.redemptionService,
      services.zuoraService,
      services.giftCodeGenerator,
      services.config.zuoraConfigProvider.get(state.user.isTestUser),
      state.user.isTestUser,
    )

    val digitalSubscriptionGiftRedemption = new DigitalSubscriptionGiftRedemption(services.zuoraGiftService, services.catalogService)

    for {
      nextState <- state match {
        case state: CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState =>
          digitalSubscriptionGiftRedemption.redeemGift(state.redemptionData, state)
        case state: CreateZuoraSubscriptionNewSubscriptionState =>
          createSubscription.create(state)
      }
    } yield HandlerResult(passThroughState.nextStateWrapper(nextState), requestInfo)

  }
}

class ZuoraSubscriptionCreator(
  now: () => DateTime,
  zuoraService: ZuoraSubscribeService,
  subscriptionDataBuilder: SubscriptionDataBuilder,
  corporateCodeStatusUpdater: CorporateCodeStatusUpdater,
) {
  import com.gu.WithLoggingSugar._
  import ZuoraSubscriptionCreator._

  def create(
    state: CreateZuoraSubscriptionNewSubscriptionState,
  ): Future[SendThankYouEmailState] =
    for {
      subscribeItem <- subscriptionDataBuilder.build(state).value.map(_.toTry).flatMap(Future.fromTry)
        .withEventualLogging("subscription data")
      identityId <- Future.fromTry(IdentityId(state.user.id))
        .withEventualLogging("identity id")
      maybeDomainSubscription <- GetSubscriptionWithCurrentRequestId(zuoraService, state.requestId, identityId, state.product.billingPeriod, now)
        .withEventualLogging("GetSubscriptionWithCurrentRequestId")
      maybePaymentSchedule <- previewIfNeeded(state, subscribeItem).sequence.withEventualLogging("PreviewPaymentSchedule")
      (account, sub) <- subscribeIfApplicable(zuoraService, subscribeItem, maybeDomainSubscription)
        .withEventualLogging("subscribe")
      _ <- updateRedemptionCodeIfApplicable(state, corporateCodeStatusUpdater)
        .withEventualLogging("update redemption code")
    } yield NextState.getEmailState(
      state,
      account,
      sub,
      maybePaymentSchedule,
      subscribeItem.subscriptionData.subscription.redemptionCode.flatMap(_.left.toOption),
      () => now().toLocalDate,
    )

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
        new DigitalSubscriptionPurchaseBuilder(
          config.digitalPack,
          promotionService,
          () => now().toLocalDate,
          giftCodeGenerator,
        ),
        new DigitalSubscriptionCorporateRedemptionBuilder(
          CorporateCodeValidator.withDynamoLookup(redemptionService),
          () => now().toLocalDate,
        ),
        promotionService,
        config.contributionConfig,
        TouchPointEnvironments.fromStage(Configuration.stage, isTestUser),
      ),
      CorporateCodeStatusUpdater.withDynamoUpdate(redemptionService),
    )

  def subscribeIfApplicable(
    zuoraService: ZuoraSubscribeService,
    subscribeItem: SubscribeItem,
    maybeDomainSubscription: Option[DomainSubscription]
  ): Future[(ZuoraAccountNumber, ZuoraSubscriptionNumber)] =
    maybeDomainSubscription match {
      case Some(domainSubscription) =>
        SafeLogger.info("Skipping subscribe for user because a subscription has already been created for this request")
        Future.successful((domainSubscription.accountNumber, domainSubscription.subscriptionNumber))
      case None => checkSingleResponse(zuoraService.subscribe(SubscribeRequest(List(subscribeItem)))).map { response =>
        (response.domainAccountNumber, response.domainSubscriptionNumber)
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
    today: () => LocalDate,
  ): SendThankYouEmailState =
    (state, paymentSchedule, maybeGeneratedGiftCode) match {
      case (state: CreateZuoraSubscriptionContributionState, None, None) =>
        state.nextState(accountNumber)
      case (state: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState, Some(paymentSchedule), None) =>
        state.nextState(paymentSchedule, accountNumber, subscriptionNumber)
      case (state: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState, Some(paymentSchedule), Some(giftCode)) =>
        val lastRedemptionDate = today().plusMonths(GiftCodeValidator.expirationTimeInMonths).minusDays(1)
        state.nextState(paymentSchedule, giftCode, lastRedemptionDate, accountNumber)
      case (state: CreateZuoraSubscriptionPaperState, Some(paymentSchedule), None) =>
        state.nextState(paymentSchedule, accountNumber, subscriptionNumber)
      case (state: CreateZuoraSubscriptionGuardianWeeklyState, Some(paymentSchedule), None) =>
        state.nextState(paymentSchedule, accountNumber, subscriptionNumber)
      case (state: CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState, None, None) =>
        state.nextState(subscriptionNumber)
      case _ => throw new RuntimeException("could not create value state")
    }
  // scalastyle:on cyclomatic.complexity

}

class DigitalSubscriptionGiftRedemption(
  zuoraService: ZuoraGiftService,
  catalogService: CatalogService,
) {

  def redeemGift(
    redemptionData: RedemptionData,
    state: CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState,
  ): Future[SendThankYouEmailState] = {
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
      handlerResult <- Future.fromTry(buildHandlerResult(state, termDates))
    } yield handlerResult
  }

  private def buildHandlerResult(
    state: CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState,
    termDates: TermDates,
  ) = Success(state.nextState(termDates))

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
