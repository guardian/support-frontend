package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.monitoring.SafeLogger
import com.gu.salesforce.Salesforce.{DeliveryContact, NewContact, SalesforceContactRecords, SalesforceContactResponse}
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.RequestInfo
import com.gu.support.workers.exceptions.SalesforceException
import com.gu.support.workers.states.{CreateSalesforceContactState, CreateZuoraSubscriptionState}

import scala.concurrent.ExecutionContext.Implicits.global

class CreateSalesforceContact extends ServicesHandler[CreateSalesforceContactState, CreateZuoraSubscriptionState](ServiceProvider) {

  override protected def servicesHandler(state: CreateSalesforceContactState, requestInfo: RequestInfo, context: Context, services: Services) = {
    SafeLogger.debug(s"CreateSalesforceContact state: $state")

    services.salesforceService.createContactRecords(state.user, state.giftRecipient)
      .map(response =>
        if (response.successful) {
          HandlerResult(getCreateZuoraSubscriptionState(state, response.contactRecords), requestInfo)
        } else {
          val errorMessage = response.errorMessage.getOrElse("No error message returned")
          SafeLogger.warn(s"Error creating Salesforce contact:\n$errorMessage")
          throw new SalesforceException(errorMessage)
        })
  }

  private def getCreateZuoraSubscriptionState(state: CreateSalesforceContactState, response: SalesforceContactRecords) =
    CreateZuoraSubscriptionState(
      state.requestId,
      state.user,
      state.giftRecipient,
      state.product,
      state.paymentMethod,
      state.firstDeliveryDate,
      state.promoCode,
      response.buyer,
      response,
      state.acquisitionData
    )
}
