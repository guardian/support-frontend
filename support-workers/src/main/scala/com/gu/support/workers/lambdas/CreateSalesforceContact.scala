package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.monitoring.SafeLogger
import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.RequestInfo
import com.gu.support.workers.exceptions.SalesforceException
import com.gu.support.workers.states.{CreateSalesforceContactState, CreateZuoraSubscriptionState}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class CreateSalesforceContact extends ServicesHandler[CreateSalesforceContactState, CreateZuoraSubscriptionState](ServiceProvider) {

  override protected def servicesHandler(
    state: CreateSalesforceContactState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): Future[HandlerResult[CreateZuoraSubscriptionState]] = {
    SafeLogger.debug(s"CreateSalesforceContact state: $state")

    services.salesforceService.createContactRecords(state.user, state.giftRecipient).flatMap { response =>
      if (response.successful) {
        Future.successful(HandlerResult(getCreateZuoraSubscriptionState(state, response.contactRecords), requestInfo))
      } else {
        val errorMessage = response.errorMessage.getOrElse("No error message returned")
        SafeLogger.warn(s"Error creating Salesforce contact:\n$errorMessage")
        Future.failed(new SalesforceException(errorMessage))
      }
    }
  }

  private def getCreateZuoraSubscriptionState(
    state: CreateSalesforceContactState,
    response: SalesforceContactRecords
  ): CreateZuoraSubscriptionState =
    CreateZuoraSubscriptionState(
      state.requestId,
      state.user,
      state.giftRecipient,
      state.redemptionData,
      state.product,
      state.paymentMethod,
      state.firstDeliveryDate,
      state.promoCode,
      response,
      state.acquisitionData
    )
}
