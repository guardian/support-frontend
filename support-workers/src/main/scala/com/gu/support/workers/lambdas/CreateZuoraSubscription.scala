package com.gu.support.workers.lambdas

import cats.implicits._
import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog
import com.gu.support.catalog._
import com.gu.support.config.{TouchPointEnvironment, TouchPointEnvironments, ZuoraConfig}
import com.gu.support.redemption._
import com.gu.support.redemption.corporate._
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.workers._
import com.gu.support.workers.states.CreateZuoraSubscriptionState._
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, PassThroughState, SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.support.zuora.api._
import com.gu.support.zuora.api.response.{Subscription, ZuoraAccountNumber, ZuoraSubscriptionNumber, ZuoraSuccessOrFailureResponse}
import com.gu.support.zuora.domain.DomainSubscription
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.buildContributionSubscription
import com.gu.zuora.subscriptionBuilders._
import com.gu.zuora.{ZuoraGiftService, ZuoraSubscribeService}
import org.joda.time.{DateTime, DateTimeZone, Days, LocalDate}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success}
import com.gu.WithLoggingSugar._
import ZuoraSubscriptionCreator._

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

    val subscriptionCreator = SubscriptionCreator(services, state.user.isTestUser)

    subscriptionCreator.create(state).map(nextState => HandlerResult(passThroughState.nextStateWrapper(nextState), requestInfo))

  }

}

object SubscriptionCreator {

  def apply(services: Services, isTestUser: Boolean) = {
    val config = services.config.zuoraConfigProvider.get(isTestUser)
    val now = () => DateTime.now(DateTimeZone.UTC)
    val corporateCodeStatusUpdater = CorporateCodeStatusUpdater.withDynamoUpdate(services.redemptionService)

    val touchPointEnvironment = TouchPointEnvironments.fromStage(Configuration.stage, isTestUser)

    val digitalSubscriptionPurchaseBuilder = new DigitalSubscriptionPurchaseBuilder(
      config.digitalPack,
      services.promotionService,
      () => now().toLocalDate,
      services.giftCodeGenerator,
      touchPointEnvironment,
    )
    val digitalSubscriptionCorporateRedemptionBuilder = new DigitalSubscriptionCorporateRedemptionBuilder(
      CorporateCodeValidator.withDynamoLookup(services.redemptionService),
      () => now().toLocalDate,
      touchPointEnvironment,
    )
    val paperSubscriptionBuilder = new PaperSubscriptionBuilder(services.promotionService, touchPointEnvironment)
    val guardianWeeklySubscriptionBuilder = new GuardianWeeklySubscriptionBuilder(services.promotionService, touchPointEnvironment)

    val zuoraSubscriptionCreator = new ZuoraSubscriptionCreator(services.zuoraService, now)

    val digitalSubscriptionGiftRedemption = new DigitalSubscriptionGiftRedemption(services.zuoraGiftService, services.catalogService)
    val digitalSubscriptionGiftPurchase = new DigitalSubscriptionGiftPurchase(
      zuoraSubscriptionCreator, now, digitalSubscriptionPurchaseBuilder, touchPointEnvironment
    )

    new SubscriptionCreator(
      config, corporateCodeStatusUpdater, digitalSubscriptionPurchaseBuilder, digitalSubscriptionCorporateRedemptionBuilder, paperSubscriptionBuilder,
      guardianWeeklySubscriptionBuilder, zuoraSubscriptionCreator, digitalSubscriptionGiftRedemption, digitalSubscriptionGiftPurchase
    )
  }

}
class SubscriptionCreator(
  config: ZuoraConfig,
  corporateCodeStatusUpdater: CorporateCodeStatusUpdater,
  digitalSubscriptionPurchaseBuilder: DigitalSubscriptionPurchaseBuilder,
  digitalSubscriptionCorporateRedemptionBuilder: DigitalSubscriptionCorporateRedemptionBuilder,
  paperSubscriptionBuilder: PaperSubscriptionBuilder,
  guardianWeeklySubscriptionBuilder: GuardianWeeklySubscriptionBuilder,
  zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
  digitalSubscriptionGiftRedemption: DigitalSubscriptionGiftRedemption,
  digitalSubscriptionGiftPurchase: DigitalSubscriptionGiftPurchase
) {

  def create(state: CreateZuoraSubscriptionState) =
    state match {
      case state: CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState =>
        digitalSubscriptionGiftRedemption.redeemGift(state)
      case state: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState =>
        for {
          subscribeItem <- Future.fromTry(digitalSubscriptionPurchaseBuilder.build(state).leftMap(BuildSubscribePromoError).toTry)
            .withEventualLogging("subscription data")
          (account, sub, paymentSchedule) <- zuoraSubscriptionCreator.ensureSubscriptionCreatedWithPreview(state, subscribeItem)
        } yield state.nextState(paymentSchedule, account, sub)
      case state: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState =>
        digitalSubscriptionGiftPurchase.build(state)
      case state: CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState =>
        for {
          subscribeItem <- digitalSubscriptionCorporateRedemptionBuilder.build(state).leftMap(BuildSubscribeRedemptionError).value.map(_.toTry).flatMap(
            Future.fromTry
          )
            .withEventualLogging("subscription data")
          (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(state, subscribeItem)
          _ <- corporateCodeStatusUpdater.setStatus(state.redemptionData.redemptionCode, RedemptionTable.AvailableField.CodeIsUsed)
            .withEventualLogging("update redemption code")
        } yield state.nextState(sub)
      case state: CreateZuoraSubscriptionContributionState =>
        for {
          (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(state, buildContributionSubscription(state, config.contributionConfig))
        } yield state.nextState(account)
      case state: CreateZuoraSubscriptionPaperState =>
        for {
          subscribeItem <- Future.fromTry(paperSubscriptionBuilder.build(state).leftMap(BuildSubscribePromoError).toTry)
            .withEventualLogging("subscription data")
          (account, sub, paymentSchedule) <- zuoraSubscriptionCreator.ensureSubscriptionCreatedWithPreview(state, subscribeItem)
        } yield state.nextState(paymentSchedule, account, sub)
      case state: CreateZuoraSubscriptionGuardianWeeklyState =>
        for {
          subscribeItem <- Future.fromTry(guardianWeeklySubscriptionBuilder.build(state).leftMap(BuildSubscribePromoError).toTry)
            .withEventualLogging("subscription data")
          (account, sub, paymentSchedule) <- zuoraSubscriptionCreator.ensureSubscriptionCreatedWithPreview(state, subscribeItem)
        } yield state.nextState(paymentSchedule, account, sub)

    }

}

class ZuoraSubscriptionCreator(zuoraService: ZuoraSubscribeService, now: () => DateTime) {

  def ensureSubscriptionCreatedWithPreview(state: CreateZuoraSubscriptionNewSubscriptionState, subscribeItem: SubscribeItem): Future[(ZuoraAccountNumber, ZuoraSubscriptionNumber, PaymentSchedule)] =
    for {
      paymentSchedule <- PreviewPaymentSchedule.preview(subscribeItem, state.product.billingPeriod, zuoraService, checkSingleResponse)
        .withEventualLogging("PreviewPaymentSchedule")
      (account, sub) <- ensureSubscriptionCreated(state, subscribeItem)
    } yield (account, sub, paymentSchedule)

  def ensureSubscriptionCreated(state: CreateZuoraSubscriptionNewSubscriptionState, subscribeItem: SubscribeItem): Future[(ZuoraAccountNumber, ZuoraSubscriptionNumber)] =
    for {
      identityId <- Future.fromTry(IdentityId(state.user.id))
        .withEventualLogging("identity id")
      maybeDomainSubscription <- GetSubscriptionWithCurrentRequestId(zuoraService, state.requestId, identityId, state.product.billingPeriod, now)
        .withEventualLogging("GetSubscriptionWithCurrentRequestId")
      (account, sub) <- ZuoraSubscriptionCreator.subscribeIfApplicable(zuoraService, subscribeItem, maybeDomainSubscription)
        .withEventualLogging("subscribe")
    } yield (account, sub)

}

object ZuoraSubscriptionCreator {

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

}

class DigitalSubscriptionGiftPurchase(zuoraSubscriptionCreator: ZuoraSubscriptionCreator, now: () => DateTime, digitalSubscriptionPurchaseBuilder: DigitalSubscriptionPurchaseBuilder, touchPointEnvironment: TouchPointEnvironment) {

  def build(state: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState) = {
    for {
      subscribeItem <- Future.fromTry(digitalSubscriptionPurchaseBuilder.build(state).leftMap(BuildSubscribePromoError).toTry)
        .withEventualLogging("subscription data")
      (account, sub, paymentSchedule) <- zuoraSubscriptionCreator.ensureSubscriptionCreatedWithPreview(state, subscribeItem)
        .withEventualLogging("update redemption code")
    } yield {
      val giftCode = subscribeItem.subscriptionData.subscription.redemptionCode.flatMap(_.left.toOption)
      val lastRedemptionDate = (() => now().toLocalDate) ().plusMonths(
        GiftCodeValidator.expirationTimeInMonths
      ).minusDays(1)
      state.nextState(paymentSchedule, giftCode.get, lastRedemptionDate, account)
    }
  }

}

class DigitalSubscriptionGiftRedemption(
  zuoraService: ZuoraGiftService,
  catalogService: CatalogService,
) {

  def redeemGift(
    state: CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState,
  ): Future[SendThankYouEmailState] = {
    val codeValidator = new GiftCodeValidator(zuoraService)
    val zuoraUpdater = new ZuoraUpdater(zuoraService, catalogService)
    for {
      codeValidation <- codeValidator.getStatus(state.redemptionData.redemptionCode, Some(state.requestId.toString))
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
