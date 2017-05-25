package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.salesforce.Salesforce.UpsertData
import com.gu.services.Services
import com.gu.support.workers.exceptions.SalesforceException
import com.gu.support.workers.model.{CreateSalesforceContactState, CreateZuoraSubscriptionState}
import com.gu.zuora.encoding.CustomCodecs.{decodeCountry, decodeCurrency, encodeCountryAsAlpha2, encodeCurrency}
import io.circe.generic.auto._

import scala.concurrent.ExecutionContext.Implicits.global

class CreateSalesforceContact extends ServicesHandler[CreateSalesforceContactState, CreateZuoraSubscriptionState] {

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
        CreateZuoraSubscriptionState(state.user, state.contribution, state.paymentMethod, response.ContactRecord)
      } else {
        val errorMessage = response.ErrorString.getOrElse("No error message returned")
        logger.error(s"Error creating Salesforce contact:\n$errorMessage")
        throw new SalesforceException(errorMessage)
      })
  }
}
