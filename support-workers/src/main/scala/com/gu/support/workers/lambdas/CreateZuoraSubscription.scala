package com.gu.support.workers.lambdas

import java.time.OffsetDateTime

import cats.data.EitherT
import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.config.Configuration.zuoraConfigProvider
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.config.{Stage, TouchPointEnvironments}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.redemption.{GetCodeStatus, RedemptionTable}
import com.gu.support.workers._
import com.gu.support.workers.exceptions.{RetryException, RetryNone}
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.support.zuora.api._
import com.gu.support.zuora.api.response._
import com.gu.support.zuora.domain.DomainSubscription
import com.gu.zuora.ProductSubscriptionBuilders._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import cats.implicits._
import org.joda.time.{DateTimeZone, LocalDate}

case class BuildSubscribeEffectError(message: String) extends RuntimeException {
  def asRetryException: RetryException =
    new RetryNone(message, cause = this)
}

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[CreateZuoraSubscriptionState, SendThankYouEmailState](servicesProvider) {

  import com.gu.FutureLogging._

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {
    val now = () => OffsetDateTime.now
    val now2 = () => LocalDate.now(DateTimeZone.UTC)
    for {
      subscriptionData <- buildSubscriptionData(state, services.promotionService, GetCodeStatus.withDynamoLookup(services.redemptionService), now2)
      subscribeItem = buildSubscribeItem(state, subscriptionData)
      identityId <- Future.fromTry(IdentityId(state.user.id))
        .withLogging("identity id")
      maybeDomainSubscription <- GetSubscriptionWithCurrentRequestId(services.zuoraService, state.requestId, identityId, state.product.billingPeriod, now)
          .withLogging("GetSubscriptionWithCurrentRequestId")
      previewPaymentSchedule <- PreviewPaymentSchedule(subscribeItem, state.product.billingPeriod, services, checkSingleResponse)
          .withLogging("PreviewPaymentSchedule")
      thankYouState <- maybeDomainSubscription match {
        case Some(domainSubscription) => skipSubscribe(state, requestInfo, previewPaymentSchedule, domainSubscription)
            .withLogging("skipSubscribe")
        case None => subscribe(state, subscribeItem, services).map(response => toHandlerResult(state, response, previewPaymentSchedule, requestInfo))
          .withLogging("subscribe")
      }
    } yield thankYouState
  }

  def skipSubscribe(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    previewedPaymentSchedule: PaymentSchedule,
    subscription: DomainSubscription
  ): FutureHandlerResult = {
    val message = "Skipping subscribe for user because a subscription has already been created for this request"
    SafeLogger.info(message)
    Future.successful(HandlerResult(
      getEmailState(state, subscription.accountNumber, subscription.subscriptionNumber, previewedPaymentSchedule),
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

  def subscribe(state: CreateZuoraSubscriptionState, subscribeItem: SubscribeItem, services: Services): Future[SubscribeResponseAccount] =
    singleSubscribe(services.zuoraService.subscribe)(subscribeItem)

  def toHandlerResult(
    state: CreateZuoraSubscriptionState,
    response: SubscribeResponseAccount,
    previewedPaymentSchedule: PaymentSchedule,
    requestInfo: RequestInfo
  ): HandlerResult[SendThankYouEmailState] =
    HandlerResult(getEmailState(state, response.domainAccountNumber, response.domainSubscriptionNumber, previewedPaymentSchedule), requestInfo)

  private def getEmailState(
    state: CreateZuoraSubscriptionState,
    accountNumber: ZuoraAccountNumber,
    subscriptionNumber: ZuoraSubscriptionNumber,
    paymentSchedule: PaymentSchedule
  ) =
    SendThankYouEmailState(
      state.requestId,
      state.user,
      state.giftRecipient,
      state.product,
      state.paymentMethod,
      state.firstDeliveryDate,
      state.promoCode,
      state.salesforceContacts.buyer,
      accountNumber.value,
      subscriptionNumber.value,
      paymentSchedule,
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
    now: () => LocalDate
  ): Future[SubscriptionData] = {
    val isTestUser = state.user.isTestUser
    val config = zuoraConfigProvider.get(isTestUser)
    val stage = Configuration.stage

    val eventualErrorOrSubscriptionData = state.product match {
      case c: Contribution => EitherT.pure[Future, String](buildContributionSubscription(c, state.requestId, config))
      case d: DigitalPack => buildDigitalPackSubscription(
        d,
        state.requestId,
        state.user.billingAddress.country,
        state.paymentMethod.leftMap(_ => (config.digitalPack, state.promoCode)),
        promotionService,
        stage,
        isTestUser,
        getCodeStatus,
        now
      )
      case p: Paper => EitherT.fromEither[Future](buildPaperSubscription(
        p,
        state.requestId,
        state.user.billingAddress.country,
        state.promoCode,
        state.firstDeliveryDate,
        promotionService,
        stage,
        isTestUser
      ).leftMap(_.msg))
      case w: GuardianWeekly => {
        val readerType: ReaderType = state.giftRecipient match  {
          case _: Some[GiftRecipient] => ReaderType.Gift
          case _ => ReaderType.Direct
        }
        EitherT.fromEither[Future](buildGuardianWeeklySubscription(
          w,
          state.requestId,
          state.user.billingAddress.country,
          state.promoCode,
          state.firstDeliveryDate,
          promotionService,
          readerType,
          stage,
          isTestUser
        ).leftMap(_.msg))
      }
    }
    eventualErrorOrSubscriptionData.value.flatMap { errorOrSubscriptionData =>
      Future.fromTry(errorOrSubscriptionData.left.map(BuildSubscribeEffectError).toTry)
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
}
