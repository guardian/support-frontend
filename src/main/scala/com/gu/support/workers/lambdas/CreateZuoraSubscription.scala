package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration.zuoraConfigProvider
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromotionService
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.support.workers._
import com.gu.support.zuora.api._
import com.gu.support.zuora.api.response._
import com.gu.support.zuora.domain.DomainSubscription
import com.gu.zuora.ProductSubscriptionBuilders._
import io.circe.generic.auto._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[CreateZuoraSubscriptionState, SendThankYouEmailState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {
    val subscribeItem = buildSubscribeItem(state, services.promotionService)
    for {
      identityId <- Future.fromTry(IdentityId(state.user.id))
      maybeDomainSubscription <- GetRecurringSubscription(services.zuoraService, state.requestId, identityId, state.product.billingPeriod)
      previewPaymentSchedule <- PreviewPaymentSchedule(subscribeItem, state.product.billingPeriod, services, checkSingleResponse)
      thankYouState <- maybeDomainSubscription match {
        case Some(domainSubscription) => skipSubscribe(state, requestInfo, previewPaymentSchedule, domainSubscription)
        case None => subscribe(state, subscribeItem, previewPaymentSchedule, requestInfo, services)
      }
    } yield thankYouState
  }

  def skipSubscribe(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    previewedPaymentSchedule: PaymentSchedule,
    subscription: DomainSubscription
  ): FutureHandlerResult = {
    val message = "Skipping subscribe for user because they are already an active contributor"
    SafeLogger.info(message)
    FutureHandlerResult(
      getEmailState(state, subscription.accountNumber, subscription.subscriptionNumber, previewedPaymentSchedule),
      requestInfo.appendMessage(message)
    )
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

  def subscribe(
    state: CreateZuoraSubscriptionState,
    subscribeItem: SubscribeItem,
    previewedPaymentSchedule: PaymentSchedule,
    requestInfo: RequestInfo,
    services: Services
  ): FutureHandlerResult =
    singleSubscribe(services.zuoraService.subscribe)(subscribeItem)
      .map(response =>
        HandlerResult(getEmailState(state, response.domainAccountNumber, response.domainSubscriptionNumber, previewedPaymentSchedule), requestInfo))

  private def getEmailState(
    state: CreateZuoraSubscriptionState,
    accountNumber: ZuoraAccountNumber,
    subscriptionNumber: ZuoraSubscriptionNumber,
    paymentSchedule: PaymentSchedule
  ) =
    SendThankYouEmailState(
      state.requestId,
      state.user,
      state.product,
      state.paymentMethod,
      state.salesForceContact,
      accountNumber.value,
      subscriptionNumber.value,
      paymentSchedule,
      state.acquisitionData
    )

  private def buildSubscribeItem(state: CreateZuoraSubscriptionState, promotionService: PromotionService): SubscribeItem = {
    //Documentation for this request is here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
    SubscribeItem(
      buildAccount(state),
      buildContactDetails(state),
      state.paymentMethod,
      buildSubscriptionData(state, promotionService),
      SubscribeOptions()
    )
  }

  private def buildSubscriptionData(state: CreateZuoraSubscriptionState, promotionService: PromotionService) = {
    val config = zuoraConfigProvider.get(state.user.isTestUser)
    state.product match {
      case c: Contribution => c.build(config)
      case d: DigitalPack => d.build(config, state.user.country, state.promoCode, promotionService)
    }
  }

  private def buildContactDetails(state: CreateZuoraSubscriptionState) = {
    ContactDetails(
      firstName = state.user.firstName,
      lastName = state.user.lastName,
      workEmail = state.user.primaryEmailAddress,
      country = state.user.country,
      state = state.user.state
    )
  }

  private def buildAccount(state: CreateZuoraSubscriptionState) = Account(
    state.salesForceContact.AccountId, //We store the Salesforce Account id in the name field
    state.product.currency,
    state.salesForceContact.AccountId, //Somewhere else we store the Salesforce Account id
    state.salesForceContact.Id,
    state.user.id,
    PaymentGateway.forPaymentMethod(state.paymentMethod, state.product.currency),
    state.requestId.toString
  )
}
