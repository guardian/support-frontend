package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.salesforce.Salesforce.UpsertData
import com.gu.services.Services
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.exceptions.SalesforceException
import com.gu.support.workers.model.monthlyContributions.state.{CreateSalesforceContactState, CreateZuoraSubscriptionState}
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.ExecutionContext.Implicits.global

class CreateSalesforceContact extends ServicesHandler[CreateSalesforceContactState, CreateZuoraSubscriptionState] with LazyLogging {

  override protected def servicesHandler(state: CreateSalesforceContactState, context: Context, services: Services) = {
    logger.debug(s"CreateSalesforceContact state: $state")
    services.salesforceService.upsert(UpsertData.create(
      state.user.id,
      state.user.primaryEmailAddress,
      state.user.firstName,
      state.user.lastName,
      state.user.allowMembershipMail,
      state.user.allowThirdPartyMail,
      state.user.allowThirdPartyMail
    )).map(response =>
      if (response.Success) {
        CreateZuoraSubscriptionState(state.requestId, state.user, state.contribution, state.paymentMethod, response.ContactRecord)
      } else {
        val errorMessage = response.ErrorString.getOrElse("No error message returned")
        logger.warn(s"Error creating Salesforce contact:\n$errorMessage")
        throw new SalesforceException(errorMessage)
      })
  }
}
