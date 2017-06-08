package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration.zuoraConfigProvider
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.state.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.zuora.model._
import com.typesafe.scalalogging.LazyLogging
import org.joda.time.{DateTimeZone, LocalDate}

import scala.concurrent.ExecutionContext.Implicits.global

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[CreateZuoraSubscriptionState, SendThankYouEmailState](servicesProvider)
    with LazyLogging {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(state: CreateZuoraSubscriptionState, context: Context, services: Services) =
    services.zuoraService.subscribe(buildSubscribeRequest(state)).map { response =>
      SendThankYouEmailState(state.user, state.contribution, state.paymentMethod, state.salesForceContact, response.head.accountNumber)
    }

  private def buildSubscribeRequest(state: CreateZuoraSubscriptionState) = {
    //Documentation for this request is here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
    val config = zuoraConfigProvider.get(state.user.isTestUser)

    val account = Account(
      state.salesForceContact.AccountId, //We store the Salesforce Account id in the name field
      state.contribution.currency,
      state.salesForceContact.AccountId, //Somewhere else we store the Salesforce Account id
      state.salesForceContact.Id,
      state.user.id,
      PaymentGateway.forPaymentMethod(state.paymentMethod)
    )

    val contactDetails = ContactDetails(
      state.user.firstName,
      state.user.lastName,
      state.user.primaryEmailAddress,
      state.user.country
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
}
