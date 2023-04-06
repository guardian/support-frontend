package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.helpers.DateGenerator
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.workers._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState._
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendAcquisitionEventState}
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.productHandlers._
import com.gu.zuora.subscriptionBuilders._

import scala.concurrent.ExecutionContext.Implicits.global

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[CreateZuoraSubscriptionState, SendAcquisitionEventState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
      zuoraSubscriptionState: CreateZuoraSubscriptionState,
      requestInfo: RequestInfo,
      context: Context,
      services: Services,
  ): FutureHandlerResult = {

    val zuoraProductHandlers = new ZuoraProductHandlers(services, zuoraSubscriptionState)
    import zuoraProductHandlers._

    val eventualSendThankYouEmailState = zuoraSubscriptionState.productSpecificState match {
      case state: SupporterPlusState =>
        zuoraSupporterPlusHandler.subscribe(
          state,
          zuoraSubscriptionState.csrUsername,
          zuoraSubscriptionState.salesforceCaseId,
          zuoraSubscriptionState.acquisitionData.map(_.supportAbTests),
        )
      case state: DigitalSubscriptionGiftRedemptionState =>
        zuoraDigitalSubscriptionGiftRedemptionHandler.redeemGift(state)
      case state: DigitalSubscriptionDirectPurchaseState =>
        zuoraDigitalSubscriptionDirectHandler.subscribe(
          state,
          zuoraSubscriptionState.csrUsername,
          zuoraSubscriptionState.salesforceCaseId,
          zuoraSubscriptionState.acquisitionData,
        )
      case state: DigitalSubscriptionGiftPurchaseState =>
        zuoraDigitalSubscriptionGiftPurchaseHandler.subscribe(
          state,
          zuoraSubscriptionState.csrUsername,
          zuoraSubscriptionState.salesforceCaseId,
        )
      case state: ContributionState =>
        zuoraContributionHandler.subscribe(state)
      case state: PaperState =>
        zuoraPaperHandler.subscribe(state, zuoraSubscriptionState.csrUsername, zuoraSubscriptionState.salesforceCaseId)
      case state: GuardianWeeklyState =>
        zuoraGuardianWeeklyHandler.subscribe(
          state,
          zuoraSubscriptionState.csrUsername,
          zuoraSubscriptionState.salesforceCaseId,
        )
    }

    eventualSendThankYouEmailState.map { nextState =>
      HandlerResult(
        SendAcquisitionEventState(
          requestId = zuoraSubscriptionState.requestId,
          analyticsInfo = zuoraSubscriptionState.analyticsInfo,
          sendThankYouEmailState = nextState,
          acquisitionData = zuoraSubscriptionState.acquisitionData,
        ),
        requestInfo,
      )
    }
  }
}

class ZuoraProductHandlers(services: Services, state: CreateZuoraSubscriptionState) {

  lazy val zuoraDigitalSubscriptionGiftRedemptionHandler = new ZuoraDigitalSubscriptionGiftRedemptionHandler(
    services.zuoraGiftService,
    services.catalogService,
    state.user,
    state.requestId,
  )
  lazy val subscribeItemBuilder = new SubscribeItemBuilder(
    state.requestId,
    state.user,
    state.product.currency,
    services.config.zuoraConfigProvider.get(isTestUser).invoiceTemplateIds,
  )
  lazy val zuoraDigitalSubscriptionGiftPurchaseHandler = new ZuoraDigitalSubscriptionGiftPurchaseHandler(
    zuoraSubscriptionCreator,
    dateGenerator,
    new DigitalSubscriptionGiftPurchaseBuilder(
      services.promotionService,
      dateGenerator,
      services.giftCodeGenerator,
      touchPointEnvironment,
      subscribeItemBuilder,
    ),
    state.user,
  )
  lazy val zuoraDigitalSubscriptionDirectHandler = new ZuoraDigitalSubscriptionDirectHandler(
    zuoraSubscriptionCreator,
    new DigitalSubscriptionDirectPurchaseBuilder(
      services.config.zuoraConfigProvider.get(isTestUser).digitalPack,
      services.promotionService,
      dateGenerator,
      touchPointEnvironment,
      subscribeItemBuilder,
    ),
    state.user,
  )
  lazy val zuoraContributionHandler = new ZuoraContributionHandler(
    zuoraSubscriptionCreator,
    new ContributionSubscriptionBuilder(
      services.config.zuoraConfigProvider.get(isTestUser).contributionConfig,
      subscribeItemBuilder,
    ),
    state.user,
  )
  lazy val zuoraSupporterPlusHandler = new ZuoraSupporterPlusHandler(
    zuoraSubscriptionCreator,
    new SupporterPlusSubcriptionBuilder(
      services.config.zuoraConfigProvider.get(isTestUser).supporterPlusConfig,
      services.catalogService,
      dateGenerator,
      touchPointEnvironment,
      subscribeItemBuilder,
    ),
    state.user,
  )
  lazy val zuoraPaperHandler = new ZuoraPaperHandler(
    zuoraSubscriptionCreator,
    new PaperSubscriptionBuilder(services.promotionService, touchPointEnvironment, subscribeItemBuilder),
  )
  lazy val zuoraGuardianWeeklyHandler = new ZuoraGuardianWeeklyHandler(
    zuoraSubscriptionCreator,
    new GuardianWeeklySubscriptionBuilder(
      services.promotionService,
      touchPointEnvironment,
      dateGenerator,
      subscribeItemBuilder,
    ),
  )
  private lazy val isTestUser = state.user.isTestUser
  private lazy val dateGenerator = new DateGenerator()
  private lazy val touchPointEnvironment = TouchPointEnvironments.fromStage(Configuration.stage, isTestUser)
  private lazy val zuoraSubscriptionCreator =
    new ZuoraSubscriptionCreator(services.zuoraService, dateGenerator, state.user.id, state.requestId)

}
