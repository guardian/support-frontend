package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration.zuoraConfigProvider
import com.gu.monitoring.products.RecurringContributionsMetrics
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.RequestInfo
import com.gu.support.workers.model.monthlyContributions.state.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.zuora.model._
import com.gu.zuora.model.response.{Subscription => SubscriptionResponse}
import com.typesafe.scalalogging.LazyLogging
import org.joda.time.{DateTimeZone, LocalDate}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[CreateZuoraSubscriptionState, SendThankYouEmailState](servicesProvider)
    with LazyLogging {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult =
    services.zuoraService.getRecurringSubscription(state.user.id, state.contribution.billingPeriod).flatMap {
      case Some(sub) => skipSubscribe(state, requestInfo, sub)
      case None => subscribe(state, requestInfo, services)
    }

  def skipSubscribe(state: CreateZuoraSubscriptionState, requestInfo: RequestInfo, subscription: SubscriptionResponse): FutureHandlerResult = {
    val message = "Skipping subscribe for user because they are already an active contributor"
    futureHandlerResult(getEmailState(state, subscription.accountNumber), requestInfo.appendMessage(message))
  }

  def subscribe(state: CreateZuoraSubscriptionState, RequestInfo: RequestInfo, services: Services): FutureHandlerResult =
    for {
      response <- services.zuoraService.subscribe(buildSubscribeRequest(state))
      _ <- putMetric(state.paymentMethod.`type`)
    } yield handlerResult(getEmailState(state, response.head.accountNumber), RequestInfo)

  private def getEmailState(state: CreateZuoraSubscriptionState, accountNumber: String) =
    SendThankYouEmailState(
      state.requestId,
      state.user,
      state.contribution,
      state.paymentMethod,
      state.salesForceContact,
      accountNumber,
      state.acquisitionData
    )

  private def buildSubscribeRequest(state: CreateZuoraSubscriptionState) = {
    //Documentation for this request is here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
    val config = zuoraConfigProvider.get(state.user.isTestUser).configForBillingPeriod(state.contribution.billingPeriod)

    val account = Account(
      state.salesForceContact.AccountId, //We store the Salesforce Account id in the name field
      state.contribution.currency,
      state.salesForceContact.AccountId, //Somewhere else we store the Salesforce Account id
      state.salesForceContact.Id,
      state.user.id,
      PaymentGateway.forPaymentMethod(state.paymentMethod)
    )

    val contactDetails = ContactDetails(
      firstName = state.user.firstName,
      lastName = state.user.lastName,
      workEmail = state.user.primaryEmailAddress,
      country = state.user.country,
      state = state.user.state
    )

    val date = LocalDate.now(DateTimeZone.UTC)

    val subscriptionData = SubscriptionData(
      List(
        RatePlanData(
          RatePlan(config.productRatePlanId),
          List(RatePlanChargeData(
            RatePlanCharge(config.productRatePlanChargeId, Some(state.contribution.amount)) //Pass the amount the user selected into Zuora
          )),
          Nil
        )
      ),
      Subscription(date, date, date)
    )

    SubscribeRequest(List(
      SubscribeItem(
        account,
        contactDetails,
        state.paymentMethod,
        subscriptionData,
        SubscribeOptions()
      )
    ))
  }

  private def putMetric(paymentType: String) =
    if (paymentType == "PayPal")
      putCloudWatchMetrics("paypal")
    else
      putCloudWatchMetrics("stripe")

  def putCloudWatchMetrics(paymentMethod: String): Future[Unit] =
    new RecurringContributionsMetrics(paymentMethod, "monthly")
      .putZuoraAccountCreated().recover({ case _ => () })
}
