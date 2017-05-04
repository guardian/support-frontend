package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners
import com.gu.salesforce.Salesforce.UpsertData
import com.gu.salesforce.SalesforceService
import com.gu.support.workers.exceptions.SalesforceException
import com.gu.support.workers.model.{CreateSalesforceContactState, CreateZuoraSubscriptionState}
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class CreateSalesforceContact(
                               salesforceService: SalesforceService = new SalesforceService(Configuration.salesforceConfig, RequestRunners.configurableFutureRunner(30.seconds))
                             ) extends FutureHandler[CreateSalesforceContactState, CreateZuoraSubscriptionState] with LazyLogging {

  override protected def handlerFuture(state: CreateSalesforceContactState, context: Context) = {
    logger.debug(s"CreateSalesforceContact state: $state")
    salesforceService.upsert(UpsertData.create(
      state.user.id,
      state.user.primaryEmailAddress,
      state.user.firstName,
      state.user.lastName,
      state.user.allowMembershipMail,
      state.user.allowThirdPartyMail,
      state.user.allowThirdPartyMail)
    ).map(response =>
      if (response.Success) {
        CreateZuoraSubscriptionState(state.user, state.amount, state.paymentMethod, response.ContactRecord)
      } else {
        val errorMessage = response.ErrorString.getOrElse("No error message returned")
        logger.error(s"Error creating Salesforce contact:\n$errorMessage")
        throw new SalesforceException(errorMessage)
      }
    )
  }
}
