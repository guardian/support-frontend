package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.monitoring.SafeLogger
import com.gu.salesforce.Salesforce.{SalesforceContactResponse, UpsertData}
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.AddressLine.asFormattedString
import com.gu.support.workers.AddressLineTransformer.combinedAddressLine
import com.gu.support.workers.RequestInfo
import com.gu.support.workers.exceptions.SalesforceException
import com.gu.support.workers.states.{CreateSalesforceContactState, CreateZuoraSubscriptionState}

import scala.concurrent.ExecutionContext.Implicits.global

class CreateSalesforceContact extends ServicesHandler[CreateSalesforceContactState, CreateZuoraSubscriptionState](ServiceProvider) {

  override protected def servicesHandler(state: CreateSalesforceContactState, requestInfo: RequestInfo, context: Context, services: Services) = {
    SafeLogger.debug(s"CreateSalesforceContact state: $state")

    val addressLine = combinedAddressLine(state.user.billingAddress.lineOne, state.user.billingAddress.lineTwo).map(asFormattedString)
    services.salesforceService.upsert(UpsertData.create(
      state.user.id,
      state.user.primaryEmailAddress,
      state.user.firstName,
      state.user.lastName,
      addressLine,
      state.user.billingAddress.city,
      state.user.billingAddress.state,
      state.user.billingAddress.postCode,
      state.user.billingAddress.country.name,
      state.user.telephoneNumber,
      state.user.allowMembershipMail,
      state.user.allowThirdPartyMail,
      state.user.allowGURelatedMail
    )).map(response =>
      if (response.Success) {
        HandlerResult(getCreateZuoraSubscriptionState(state, response), requestInfo)
      } else {
        val errorMessage = response.ErrorString.getOrElse("No error message returned")
        SafeLogger.warn(s"Error creating Salesforce contact:\n$errorMessage")
        throw new SalesforceException(errorMessage)
      })
  }

  private def getCreateZuoraSubscriptionState(state: CreateSalesforceContactState, response: SalesforceContactResponse) =
    CreateZuoraSubscriptionState(
      state.requestId,
      state.user,
      state.product,
      state.paymentMethod,
      state.promoCode,
      response.ContactRecord,
      state.acquisitionData
    )
}
