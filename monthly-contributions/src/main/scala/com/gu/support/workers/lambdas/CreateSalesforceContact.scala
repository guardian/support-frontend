package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.salesforce.Salesforce.UpsertData
import com.gu.services.Services
import com.gu.support.workers.exceptions.SalesforceException
import com.gu.support.workers.model.{CreateSalesforceContactState, CreateZuoraSubscriptionState}
import com.gu.zuora.encoding.CustomCodecs.{decodeCountry, decodeCurrency}
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._

import scala.concurrent.ExecutionContext.Implicits.global

class CreateSalesforceContact extends FutureHandler[CreateSalesforceContactState, CreateZuoraSubscriptionState] with LazyLogging {

  override protected def handlerFuture(state: CreateSalesforceContactState, context: Context) = {
    logger.debug(s"CreateSalesforceContact state: $state")
    Services.salesforceService.get(state.user.isTestUser).upsert(UpsertData.create(
      state.user.id,
      state.user.primaryEmailAddress,
      state.user.firstName,
      state.user.lastName,
      state.user.allowMembershipMail,
      state.user.allowThirdPartyMail,
      state.user.allowThirdPartyMail
    )).map(response =>
      if (response.Success) {
        CreateZuoraSubscriptionState(state.user, state.contribution, state.paymentMethod, response.ContactRecord)
      } else {
        val errorMessage = response.ErrorString.getOrElse("No error message returned")
        logger.error(s"Error creating Salesforce contact:\n$errorMessage")
        throw new SalesforceException(errorMessage)
      })
  }
}
