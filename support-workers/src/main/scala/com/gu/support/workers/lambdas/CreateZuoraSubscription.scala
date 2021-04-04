package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.redemption.corporate._
import com.gu.support.workers._
import com.gu.support.workers.states.CreateZuoraSubscriptionState._
import com.gu.support.workers.states.{CreateZuoraSubscriptionWrapperState, SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.productHandlers._
import com.gu.zuora.subscriptionBuilders._
import org.joda.time.{DateTime, DateTimeZone}

import scala.concurrent.ExecutionContext.Implicits.global

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
  extends ServicesHandler[CreateZuoraSubscriptionWrapperState, SendAcquisitionEventState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    wrapperState: CreateZuoraSubscriptionWrapperState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {

    val state = wrapperState.productSpecificState

    val zuoraProductHandlers = new ZuoraProductHandlers(services, wrapperState)
    import zuoraProductHandlers._

    val eventualSendThankYouEmailState = state match {
      case state: CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState =>
        zuoraDigitalSubscriptionGiftRedemptionHandler.redeemGift(state)
      case state: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState =>
        zuoraDigitalSubscriptionDirectHandler.subscribe(state)
      case state: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState =>
        zuoraDigitalSubscriptionGiftPurchaseHandler.subscribe(state)
      case state: CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState =>
        zuoraDigitalSubscriptionCorporateRedemptionHandler.subscribe(state)
      case state: CreateZuoraSubscriptionContributionState =>
        zuoraContributionHandler.subscribe(state)
      case state: CreateZuoraSubscriptionPaperState =>
        zuoraPaperHandler.subscribe(state)
      case state: CreateZuoraSubscriptionGuardianWeeklyState =>
        zuoraGuardianWeeklyHandler.subscribe(state)
    }

    eventualSendThankYouEmailState.map { nextState =>
      HandlerResult(
        SendAcquisitionEventState(
          requestId = wrapperState.requestId,
          analyticsInfo = wrapperState.analyticsInfo,
          sendThankYouEmailState = nextState,
          acquisitionData = wrapperState.acquisitionData,
        ),
        requestInfo,
      )
    }

  }

}

class ZuoraProductHandlers(services: Services, wrapperState: CreateZuoraSubscriptionWrapperState) {

  private val isTestUser = wrapperState.user.isTestUser
  private val now = () => DateTime.now(DateTimeZone.UTC)
  private val touchPointEnvironment = TouchPointEnvironments.fromStage(Configuration.stage, isTestUser)

  private val zuoraSubscriptionCreator = new ZuoraSubscriptionCreator(services.zuoraService, now, wrapperState.user.id, wrapperState.requestId)

  val zuoraDigitalSubscriptionGiftRedemptionHandler = new ZuoraDigitalSubscriptionGiftRedemptionHandler(
    services.zuoraGiftService,
    services.catalogService,
    wrapperState.user,
    wrapperState.requestId,
  )

  val subscribeItemBuilder = new SubscribeItemBuilder(
    wrapperState.requestId,
    wrapperState.user,
    wrapperState.product.currency,
  )

  val zuoraDigitalSubscriptionGiftPurchaseHandler = new ZuoraDigitalSubscriptionGiftPurchaseHandler(
    zuoraSubscriptionCreator, now,
    new DigitalSubscriptionGiftPurchaseBuilder(
      services.promotionService,
      () => now().toLocalDate,
      services.giftCodeGenerator,
      touchPointEnvironment,
      subscribeItemBuilder,
    ),
    wrapperState.user,
  )

  val zuoraDigitalSubscriptionCorporateRedemptionHandler = new ZuoraDigitalSubscriptionCorporateRedemptionHandler(
    zuoraSubscriptionCreator,
    CorporateCodeStatusUpdater.withDynamoUpdate(services.redemptionService),
    new DigitalSubscriptionCorporateRedemptionBuilder(
      CorporateCodeValidator.withDynamoLookup(services.redemptionService),
      () => now().toLocalDate,
      touchPointEnvironment,
      subscribeItemBuilder,
    ),
    wrapperState.user,
  )

  val zuoraDigitalSubscriptionDirectHandler = new ZuoraDigitalSubscriptionDirectHandler(
    zuoraSubscriptionCreator,
    new DigitalSubscriptionDirectPurchaseBuilder(
      services.config.zuoraConfigProvider.get(isTestUser).digitalPack,
      services.promotionService,
      () => now().toLocalDate,
      touchPointEnvironment,
      subscribeItemBuilder,
    ),
    wrapperState.user,
  )

  val zuoraContributionHandler = new ZuoraContributionHandler(
    zuoraSubscriptionCreator,
    new ContributionSubscriptionBuilder(
      services.config.zuoraConfigProvider.get(isTestUser).contributionConfig,
      subscribeItemBuilder,
    ),
    wrapperState.user,
  )

  val zuoraPaperHandler = new ZuoraPaperHandler(
    zuoraSubscriptionCreator,
    new PaperSubscriptionBuilder(services.promotionService, touchPointEnvironment, subscribeItemBuilder),
  )

  val zuoraGuardianWeeklyHandler = new ZuoraGuardianWeeklyHandler(
    zuoraSubscriptionCreator,
    new GuardianWeeklySubscriptionBuilder(
      services.promotionService,
      touchPointEnvironment,
      () => now().toLocalDate,
      subscribeItemBuilder,
    ),
  )

}
