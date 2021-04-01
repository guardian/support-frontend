package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.redemption.corporate._
import com.gu.support.workers._
import com.gu.support.workers.states.CreateZuoraSubscriptionState._
import com.gu.support.workers.states.{PassThroughState, SendAcquisitionEventState}
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.productHandlers._
import com.gu.zuora.subscriptionBuilders._
import org.joda.time.{DateTime, DateTimeZone}

import scala.concurrent.ExecutionContext.Implicits.global

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

    val zuoraProductHandlers = new ZuoraProductHandlers(services, state.user.isTestUser)
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

    eventualSendThankYouEmailState.map(nextState => HandlerResult(passThroughState.nextStateWrapper(nextState), requestInfo))

  }

}

class ZuoraProductHandlers(services: Services, isTestUser: Boolean) {

  private val now = () => DateTime.now(DateTimeZone.UTC)
  private val touchPointEnvironment = TouchPointEnvironments.fromStage(Configuration.stage, isTestUser)

  private val zuoraSubscriptionCreator = new ZuoraSubscriptionCreator(services.zuoraService, now)

  val zuoraDigitalSubscriptionGiftRedemptionHandler = new ZuoraDigitalSubscriptionGiftRedemptionHandler(
    services.zuoraGiftService,
    services.catalogService,
  )

  val zuoraDigitalSubscriptionGiftPurchaseHandler = new ZuoraDigitalSubscriptionGiftPurchaseHandler(
    zuoraSubscriptionCreator, now,
    new DigitalSubscriptionGiftPurchaseBuilder(
      services.promotionService,
      () => now().toLocalDate,
      services.giftCodeGenerator,
      touchPointEnvironment,
    ),
  )

  val zuoraDigitalSubscriptionCorporateRedemptionHandler = new ZuoraDigitalSubscriptionCorporateRedemptionHandler(
    zuoraSubscriptionCreator,
    CorporateCodeStatusUpdater.withDynamoUpdate(services.redemptionService),
    new DigitalSubscriptionCorporateRedemptionBuilder(
      CorporateCodeValidator.withDynamoLookup(services.redemptionService),
      () => now().toLocalDate,
      touchPointEnvironment,
    ),
  )

  val zuoraDigitalSubscriptionDirectHandler = new ZuoraDigitalSubscriptionDirectHandler(
    zuoraSubscriptionCreator,
    new DigitalSubscriptionDirectPurchaseBuilder(
      services.config.zuoraConfigProvider.get(isTestUser).digitalPack,
      services.promotionService,
      () => now().toLocalDate,
      touchPointEnvironment,
    ),
  )

  val zuoraContributionHandler = new ZuoraContributionHandler(
    zuoraSubscriptionCreator,
    new ContributionSubscriptionBuilder(
      services.config.zuoraConfigProvider.get(isTestUser).contributionConfig
    )
  )

  val zuoraPaperHandler = new ZuoraPaperHandler(
    zuoraSubscriptionCreator,
    new PaperSubscriptionBuilder(services.promotionService, touchPointEnvironment),
  )

  val zuoraGuardianWeeklyHandler = new ZuoraGuardianWeeklyHandler(
    zuoraSubscriptionCreator,
    new GuardianWeeklySubscriptionBuilder(
      services.promotionService,
      touchPointEnvironment,
      () => now().toLocalDate
    ),
  )

}

