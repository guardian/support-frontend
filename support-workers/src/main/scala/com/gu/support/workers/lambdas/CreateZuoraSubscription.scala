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
import org.joda.time.{DateTimeZone, LocalDate}

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

    val zuoraProductHandlers =
      new ZuoraProductHandlers(services, zuoraSubscriptionState, LocalDate.now(DateTimeZone.UTC))
    import zuoraProductHandlers._

    val eventualSendThankYouEmailState = zuoraSubscriptionState.productSpecificState match {
      case state: SupporterPlusState =>
        zuoraSupporterPlusHandler.subscribe(
          state,
          zuoraSubscriptionState.csrUsername,
          zuoraSubscriptionState.salesforceCaseId,
        )
      case state: TierThreeState =>
        zuoraTierThreeHandler.subscribe(
          state,
          zuoraSubscriptionState.csrUsername,
          zuoraSubscriptionState.salesforceCaseId,
        )
      case state: DigitalSubscriptionState =>
        zuoraDigitalSubscriptionDirectHandler.subscribe(
          state,
          zuoraSubscriptionState.csrUsername,
          zuoraSubscriptionState.salesforceCaseId,
        )
      case state: ContributionState =>
        zuoraContributionHandler.subscribe(state)
      case state: PaperState =>
        zuoraPaperHandler.subscribe(
          state,
          zuoraSubscriptionState.csrUsername,
          zuoraSubscriptionState.salesforceCaseId,
        )
      case state: GuardianWeeklyState =>
        zuoraGuardianWeeklyHandler.subscribe(
          state,
          zuoraSubscriptionState.csrUsername,
          zuoraSubscriptionState.salesforceCaseId,
        )
      case state: GuardianAdLiteState =>
        zuoraGuardianAdLiteHandler.subscribe(
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

class ZuoraProductHandlers(services: Services, state: CreateZuoraSubscriptionState, today: LocalDate) {
  lazy val subscribeItemBuilder = new SubscribeItemBuilder(
    state.requestId,
    state.user,
    state.product.currency,
    today,
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
