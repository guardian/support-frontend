package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.redemption.corporate._
import com.gu.support.workers._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState._
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.productHandlers._
import com.gu.zuora.subscriptionBuilders._
import org.joda.time.{DateTime, DateTimeZone}

import scala.concurrent.ExecutionContext.Implicits.global

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
  extends ServicesHandler[CreateZuoraSubscriptionState, SendAcquisitionEventState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {

    val zuoraProductHandlers = new ZuoraProductHandlers(services, state)
    import zuoraProductHandlers._

    val eventualSendThankYouEmailState = state.productSpecificState match {
      case state: DigitalSubscriptionGiftRedemptionState =>
        zuoraDigitalSubscriptionGiftRedemptionHandler.redeemGift(state)
      case state: DigitalSubscriptionDirectPurchaseState =>
        zuoraDigitalSubscriptionDirectHandler.subscribe(state)
      case state: DigitalSubscriptionGiftPurchaseState =>
        zuoraDigitalSubscriptionGiftPurchaseHandler.subscribe(state)
      case state: DigitalSubscriptionCorporateRedemptionState =>
        zuoraDigitalSubscriptionCorporateRedemptionHandler.subscribe(state)
      case state: ContributionState =>
        zuoraContributionHandler.subscribe(state)
      case state: PaperState =>
        zuoraPaperHandler.subscribe(state)
      case state: GuardianWeeklyState =>
        zuoraGuardianWeeklyHandler.subscribe(state)
    }

    eventualSendThankYouEmailState.map { nextState =>
      HandlerResult(
        SendAcquisitionEventState(
          requestId = state.requestId,
          analyticsInfo = state.analyticsInfo,
          sendThankYouEmailState = nextState,
          acquisitionData = state.acquisitionData,
        ),
        requestInfo,
      )
    }

  }

}

class ZuoraProductHandlers(services: Services, state: CreateZuoraSubscriptionState) {

  private val isTestUser = state.user.isTestUser
  private val now = () => DateTime.now(DateTimeZone.UTC)
  private val touchPointEnvironment = TouchPointEnvironments.fromStage(Configuration.stage, isTestUser)

  private val zuoraSubscriptionCreator = new ZuoraSubscriptionCreator(services.zuoraService, now, state.user.id, state.requestId)

  val zuoraDigitalSubscriptionGiftRedemptionHandler = new ZuoraDigitalSubscriptionGiftRedemptionHandler(
    services.zuoraGiftService,
    services.catalogService,
    state.user,
    state.requestId,
  )

  val subscribeItemBuilder = new SubscribeItemBuilder(
    state.requestId,
    state.user,
    state.product.currency,
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
    state.user,
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
    state.user,
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
    state.user,
  )

  val zuoraContributionHandler = new ZuoraContributionHandler(
    zuoraSubscriptionCreator,
    new ContributionSubscriptionBuilder(
      services.config.zuoraConfigProvider.get(isTestUser).contributionConfig,
      subscribeItemBuilder,
    ),
    state.user,
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
