package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration.zuoraConfigProvider
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.support.workers.model.{Contribution, DigitalPack, RequestInfo}
import com.gu.zuora.ZuoraConfig.RatePlanId
import com.gu.zuora.model._
import com.gu.zuora.model.response.{Subscription => SubscriptionResponse}
import org.joda.time.{DateTimeZone, LocalDate}

import scala.concurrent.ExecutionContext.Implicits.global

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[CreateZuoraSubscriptionState, SendThankYouEmailState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult =
    services.zuoraService.getRecurringSubscription(state.user.id, state.product.billingPeriod).flatMap {
      case Some(sub) => skipSubscribe(state, requestInfo, sub)
      case None => subscribe(state, requestInfo, services)
    }

  def skipSubscribe(state: CreateZuoraSubscriptionState, requestInfo: RequestInfo, subscription: SubscriptionResponse): FutureHandlerResult = {
    val message = "Skipping subscribe for user because they are already an active contributor"
    SafeLogger.info(message)
    FutureHandlerResult(getEmailState(state, subscription.accountNumber), requestInfo.appendMessage(message))
  }

  def subscribe(state: CreateZuoraSubscriptionState, requestInfo: RequestInfo, services: Services): FutureHandlerResult =
    services.zuoraService.subscribe(buildSubscribeRequest(state))
      .map(response =>
        HandlerResult(getEmailState(state, response.headOption.map(_.accountNumber).getOrElse("")), requestInfo))

  private def getEmailState(state: CreateZuoraSubscriptionState, accountNumber: String) =
    SendThankYouEmailState(
      state.requestId,
      state.user,
      state.product,
      state.paymentMethod,
      state.salesForceContact,
      accountNumber,
      state.acquisitionData
    )

  private def buildSubscribeRequest(state: CreateZuoraSubscriptionState) = {
    //Documentation for this request is here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
    SubscribeRequest(List(
      SubscribeItem(
        buildAccount(state),
        buildContactDetails(state),
        state.paymentMethod,
        buildSubscriptionData(state),
        SubscribeOptions()
      )
    ))
  }

  private def buildSubscriptionData(state: CreateZuoraSubscriptionState) = {
    val config = zuoraConfigProvider.get(state.user.isTestUser)
    state.product match {
      case c: Contribution =>
        val contributionConfig = config.contributionConfig(c.billingPeriod)
        buildProductSubscription(
          contributionConfig.productRatePlanId,
          List(
            RatePlanChargeData(
              RatePlanCharge(contributionConfig.productRatePlanChargeId, Some(c.amount)) //Pass the amount the user selected into Zuora
            )
          )
        )
      case d: DigitalPack => buildProductSubscription(config.digitalPackRatePlan(d.billingPeriod))
    }
  }

  private def buildProductSubscription(
    ratePlanId: RatePlanId,
    ratePlanCharges: List[RatePlanChargeData] = Nil,
    date: LocalDate = LocalDate.now(DateTimeZone.UTC)
  ) =
    SubscriptionData(
      List(
        RatePlanData(
          RatePlan(ratePlanId),
          ratePlanCharges,
          Nil
        )
      ),
      Subscription(date, date, date)
    )

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
    PaymentGateway.forPaymentMethod(state.paymentMethod, state.product.currency)
  )
}
