package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.helpers.DateGenerator
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.workers._
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendAcquisitionEventState}
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.productHandlers._
import com.gu.zuora.subscriptionBuilders._

import scala.concurrent.ExecutionContext.Implicits.global

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[CreateZuoraSubscriptionState, SendAcquisitionEventState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
      state: CreateZuoraSubscriptionState,
      requestInfo: RequestInfo,
      context: Context,
      services: Services,
  ): FutureHandlerResult = {

    val zuoraProductHandlers = new ZuoraProductHandlers(services, state)
    import zuoraProductHandlers._

    val eventualSendThankYouEmailState = state.product match {
      case product: SupporterPlus => zuoraSupporterPlusHandler.subscribe(product, state)
      case product: TierThree => zuoraTierThreeHandler.subscribe(product, state)
      case product: DigitalPack => zuoraDigitalSubscriptionDirectHandler.subscribe(product, state)
      case product: Contribution => zuoraContributionHandler.subscribe(product, state)
      case product: Paper => zuoraPaperHandler.subscribe(product, state)
      case product: GuardianWeekly => zuoraGuardianWeeklyHandler.subscribe(product, state)
      case product: GuardianAdLite => zuoraGuardianAdLiteHandler.subscribe(product, state)
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
  lazy val subscribeItemBuilder = new SubscribeItemBuilder(
    state.requestId,
    state.user,
    state.product.currency,
  )
  lazy val zuoraDigitalSubscriptionDirectHandler = new ZuoraDigitalSubscriptionHandler(
    zuoraSubscriptionCreator,
    new DigitalSubscriptionBuilder(
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
      services.promotionService,
      services.catalogService,
      dateGenerator,
      touchPointEnvironment,
      subscribeItemBuilder,
    ),
    state.user,
  )
  lazy val zuoraTierThreeHandler = new ZuoraTierThreeHandler(
    zuoraSubscriptionCreator,
    new TierThreeSubscriptionBuilder(
      services.promotionService,
      touchPointEnvironment,
      dateGenerator,
      subscribeItemBuilder,
    ),
  )
  lazy val zuoraGuardianAdLiteHandler = new ZuoraGuardianAdLiteHandler(
    zuoraSubscriptionCreator,
    new GuardianAdLiteSubscriptionBuilder(
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
