package com.gu.support.workers.lambdas

import java.util.UUID

import com.amazonaws.services.lambda.runtime.Context
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers._
import com.gu.support.workers.states.{ClonePaymentMethodState, CreateZuoraSubscriptionState}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ClonePaymentMethod(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[ClonePaymentMethodState, CreateZuoraSubscriptionState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(state: ClonePaymentMethodState, requestInfo: RequestInfo, context: Context, services: Services) = {
    SafeLogger.debug(s"CreatePaymentMethod state: $state")
    Future.successful(

      HandlerResult(
        CreateZuoraSubscriptionState(
          requestId = UUID.randomUUID(),
          user = state.user,
          product = state.product,
          paymentMethod =  PayPalReferenceTransaction("test", "test"), //todo
          firstDeliveryDate = None,
          promoCode = None,
          salesForceContact = SalesforceContactRecord("test", "test"), //todo
          acquisitionData = None
        ),
        requestInfo
      ))
  }

}
