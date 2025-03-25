package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers._
import com.gu.support.workers.exceptions.SalesforceException
import com.gu.support.workers.states.{CreateSalesforceContactState, CreateZuoraSubscriptionState}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class CreateSalesforceContact
    extends ServicesHandler[CreateSalesforceContactState, CreateZuoraSubscriptionState](ServiceProvider) {

  override protected def servicesHandler(
      state: CreateSalesforceContactState,
      requestInfo: RequestInfo,
      context: Context,
      services: Services,
  ): Future[HandlerResult[CreateZuoraSubscriptionState]] = {
    logger.debug(s"CreateSalesforceContact state: $state")

    services.salesforceService.createContactRecords(state.user, state.giftRecipient).flatMap { response =>
      if (response.successful) {
        Future.successful(HandlerResult(buildCreateZuoraSubscriptionState(state, response.contactRecords), requestInfo))
      } else {
        val errorMessage = response.errorMessage.getOrElse("No error message returned")
        logger.warn(s"Error creating Salesforce contact:\n$errorMessage")
        Future.failed(new SalesforceException(errorMessage))
      }
    }
  }

  def buildCreateZuoraSubscriptionState(
      state: CreateSalesforceContactState,
      salesforceContactRecords: SalesforceContactRecords,
  ): CreateZuoraSubscriptionState = {
    import state._
    CreateZuoraSubscriptionState(
      requestId = requestId,
      user = user,
      product = product,
      analyticsInfo = analyticsInfo,
      giftRecipient = giftRecipient,
      paymentMethod = paymentMethod,
      firstDeliveryDate = firstDeliveryDate,
      appliedPromotion = appliedPromotion,
      csrUsername = csrUsername,
      salesforceCaseId = salesforceCaseId,
      acquisitionData = acquisitionData,
      salesForceContacts = salesforceContactRecords,
    )
  }
}
