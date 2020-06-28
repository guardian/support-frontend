package com.gu.support.workers.lambdas

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.config.Configuration.zuoraConfigProvider
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.config.{TouchPointEnvironments, ZuoraConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.redemption.{DynamoLookup, DynamoUpdate, GetCodeStatus, RedemptionTable, SetCodeStatus}
import com.gu.support.redemption.GetCodeStatus.RedemptionInvalid
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers._
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.support.zuora.api._
import com.gu.support.zuora.api.response._
import com.gu.support.zuora.domain.DomainSubscription
import com.gu.zuora.ProductSubscriptionBuilders._
import com.gu.zuora.ProductSubscriptionBuilders.buildDigitalPackSubscription.{SubscriptionPaymentCorporate, SubscriptionPaymentDirect}
import com.gu.zuora.ZuoraSubscribeService
import org.joda.time.{DateTime, DateTimeZone, LocalDate}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

case class BuildSubscribePromoError(cause: PromoError) extends RuntimeException

case class BuildSubscribeRedemptionError(cause: RedemptionInvalid) extends RuntimeException

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[CreateZuoraSubscriptionState, SendThankYouEmailState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {
    val now = () => DateTime.now(DateTimeZone.UTC)
    val today = () => LocalDate.now(DateTimeZone.UTC)
    val promotionService = services.promotionService
    val redemptionService = services.redemptionService
    val zuoraService = services.zuoraService
    val isTestUser = state.user.isTestUser
    val config: ZuoraConfig = zuoraConfigProvider.get(isTestUser)
    CreateZuoraSubscription(state, requestInfo, now, today, promotionService, redemptionService, zuoraService, config)
  }
}
object CreateZuoraSubscription {
  import com.gu.FutureLogging._

  def apply(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    now: () => DateTime,
    today: () => LocalDate,
    promotionService: PromotionService,
    redemptionService: DynamoLookup with DynamoUpdate,
    zuoraService: ZuoraSubscribeService,
    config: ZuoraConfig
  ): Future[HandlerResult[SendThankYouEmailState]] = {
    for {
      subscriptionData <- buildSubscriptionData(state, promotionService, GetCodeStatus.withDynamoLookup(redemptionService), today, config)
      subscribeItem = buildSubscribeItem(state, subscriptionData)
      identityId <- Future.fromTry(IdentityId(state.user.id))
        .withLogging("identity id")
      maybeDomainSubscription <- GetSubscriptionWithCurrentRequestId(zuoraService, state.requestId, identityId, state.product.billingPeriod, now)
        .withLogging("GetSubscriptionWithCurrentRequestId")
      paymentMethodWithPaymentSchedule <-
        state.paymentMethod.leftMap(pm =>
          PreviewPaymentSchedule(subscribeItem, state.product.billingPeriod, zuoraService, checkSingleResponse)
            .withLogging("PreviewPaymentSchedule").map(ps => (pm, ps))
        ).leftSequence
      thankYouState <- maybeDomainSubscription match {
        case Some(domainSubscription) => skipSubscribe(state, requestInfo, paymentMethodWithPaymentSchedule, domainSubscription)
          .withLogging("skipSubscribe")
        case None => subscribe(subscribeItem, zuoraService).map(response => toHandlerResult(state, response, paymentMethodWithPaymentSchedule, requestInfo))
          .withLogging("subscribe")
      }
      _ <- updateRedemptionCodeIfApplicable(state.paymentMethod, SetCodeStatus.withDynamoLookup(redemptionService))
    } yield thankYouState
  }

  def skipSubscribe(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    paymentMethodWithPaymentSchedule: Either[(PaymentMethod, PaymentSchedule), RedemptionData],
    subscription: DomainSubscription
  ): Future[HandlerResult[SendThankYouEmailState]] = {
    val message = "Skipping subscribe for user because a subscription has already been created for this request"
    SafeLogger.info(message)
    Future.successful(HandlerResult(
      getEmailState(state, subscription.accountNumber, subscription.subscriptionNumber, paymentMethodWithPaymentSchedule),
      requestInfo.appendMessage(message)
    ))
  }

  def singleSubscribe(
    multiSubscribe: SubscribeRequest => Future[List[SubscribeResponseAccount]]
  ): SubscribeItem => Future[SubscribeResponseAccount] = { subscribeItem =>
    checkSingleResponse(multiSubscribe(SubscribeRequest(List(subscribeItem))))
  }

  def checkSingleResponse[ResponseItem](response: Future[List[ResponseItem]]): Future[ResponseItem] = {
    response.flatMap {
      case result :: Nil => Future.successful(result)
      case results => Future.failed(new RuntimeException(s"didn't get a single response item, got: $results"))
    }
  }

  def subscribe(subscribeItem: SubscribeItem, zuoraService: ZuoraSubscribeService): Future[SubscribeResponseAccount] =
    singleSubscribe(zuoraService.subscribe)(subscribeItem)

  def toHandlerResult(
    state: CreateZuoraSubscriptionState,
    response: SubscribeResponseAccount,
    paymentMethodWithPaymentSchedule: Either[(PaymentMethod, PaymentSchedule), RedemptionData],
    requestInfo: RequestInfo
  ): HandlerResult[SendThankYouEmailState] =
    HandlerResult(getEmailState(state, response.domainAccountNumber, response.domainSubscriptionNumber, paymentMethodWithPaymentSchedule), requestInfo)

  private def getEmailState(
    state: CreateZuoraSubscriptionState,
    accountNumber: ZuoraAccountNumber,
    subscriptionNumber: ZuoraSubscriptionNumber,
    paymentMethodWithPaymentSchedule: Either[(PaymentMethod, PaymentSchedule), RedemptionData]
  ) =
    SendThankYouEmailState(
      state.requestId,
      state.user,
      state.giftRecipient,
      state.product,
      state.paymentProvider,
      paymentMethodWithPaymentSchedule.left.map(_._1),
      state.firstDeliveryDate,
      state.promoCode,
      state.salesforceContacts.buyer,
      accountNumber.value,
      subscriptionNumber.value,
      paymentMethodWithPaymentSchedule
        .left.toOption.map(_._2).getOrElse(PaymentSchedule(List())),//TODO SendThankYou email will only need payment schedule for paid subs
      state.acquisitionData
    )

  private def buildSubscribeItem(state: CreateZuoraSubscriptionState, subscriptionData: SubscriptionData): SubscribeItem = {
    val billingEnabled = state.paymentMethod.isLeft
    //Documentation for this request is here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
    SubscribeItem(
      account = buildAccount(state),
      billToContact = buildContactDetails(state.user, None, state.user.billingAddress),
      soldToContact = state.user.deliveryAddress map (buildContactDetails(state.user, state.giftRecipient, _, state.user.deliveryInstructions)),
      paymentMethod = state.paymentMethod.left.toOption,
      subscriptionData = subscriptionData,
      subscribeOptions = SubscribeOptions(generateInvoice = billingEnabled, processPayments = billingEnabled)
    )
  }

  private def buildSubscriptionData(
    state: CreateZuoraSubscriptionState,
    promotionService: => PromotionService,
    getCodeStatus: => GetCodeStatus,
    today: () => LocalDate,
    config: ZuoraConfig
  ): Future[SubscriptionData] = {
    val isTestUser = state.user.isTestUser
    val environment = TouchPointEnvironments.fromStage(Configuration.stage, isTestUser)

    val eventualErrorOrSubscriptionData = state.product match {
      case c: Contribution => EitherT.pure[Future, Throwable](buildContributionSubscription(c, state.requestId, config))
      case d: DigitalPack => buildDigitalPackSubscription(
        d,
        state.requestId,
        state.paymentMethod match {
          case Left(_: PaymentMethod) => SubscriptionPaymentDirect(config.digitalPack, state.promoCode, state.user.billingAddress.country, promotionService)
          case Right(rd: RedemptionData) => SubscriptionPaymentCorporate(rd, getCodeStatus)
        },
        environment,
        today
      ).leftMap(_.fold(BuildSubscribePromoError, BuildSubscribeRedemptionError))
      case p: Paper => EitherT.fromEither[Future](buildPaperSubscription(
        p,
        state.requestId,
        state.user.billingAddress.country,
        state.promoCode,
        state.firstDeliveryDate,
        promotionService,
        environment
      ).leftMap(BuildSubscribePromoError))
      case w: GuardianWeekly =>
        EitherT.fromEither[Future](buildGuardianWeeklySubscription(
          w,
          state.requestId,
          state.user.billingAddress.country,
          state.promoCode,
          state.firstDeliveryDate,
          promotionService,
          if (state.giftRecipient.isDefined) ReaderType.Gift else ReaderType.Direct,
          environment
        ).leftMap(BuildSubscribePromoError))
    }
    eventualErrorOrSubscriptionData.value.flatMap { errorOrSubscriptionData =>
      Future.fromTry(errorOrSubscriptionData.toTry)
    }
  }

  private def buildContactDetails(user: User, giftRecipient: Option[GiftRecipient], address: Address, deliveryInstructions: Option[String] = None) = {
    ContactDetails(
      firstName = giftRecipient.fold(user.firstName)(_.firstName),
      lastName = giftRecipient.fold(user.lastName)(_.lastName),
      workEmail = giftRecipient.fold(Option(user.primaryEmailAddress))(_.email),
      address1 = address.lineOne,
      address2 = address.lineTwo,
      city = address.city,
      postalCode = address.postCode,
      country = address.country,
      state = address.state,
      deliveryInstructions = deliveryInstructions
    )
  }

  private def buildAccount(state: CreateZuoraSubscriptionState) = Account(
    name = state.salesforceContacts.recipient.AccountId, //We store the Salesforce Account id in the name field
    currency = state.product.currency,
    crmId = state.salesforceContacts.recipient.AccountId, //Somewhere else we store the Salesforce Account id
    sfContactId__c = state.salesforceContacts.recipient.Id,
    identityId__c = state.user.id,
    paymentGateway = state.paymentMethod.left.toOption.map(_.paymentGateway),
    createdRequestId__c = state.requestId.toString,
    autoPay = state.paymentMethod.isLeft
  )

  def updateRedemptionCodeIfApplicable(
    paymentMethod: Either[PaymentMethod, RedemptionData],
    setCodeStatus: SetCodeStatus
  ): Future[Unit] =
    paymentMethod.toOption match {
      case Some(rd: RedemptionData) =>
        setCodeStatus(
          rd.redemptionCode,
          RedemptionTable.AvailableField.CodeIsUsed
        )
      case None => Future.successful(())
    }

}
