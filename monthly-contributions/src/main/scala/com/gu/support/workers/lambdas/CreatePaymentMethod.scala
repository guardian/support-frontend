package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.i18n.CountryGroup
import com.gu.paypal.PayPalService
import com.gu.services.{ServiceProvider, Services}
import com.gu.stripe.StripeService
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.state.{CreatePaymentMethodState, CreateSalesforceContactState}
import com.gu.support.workers.model._
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.Failure

class CreatePaymentMethod(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[CreatePaymentMethodState, CreateSalesforceContactState](servicesProvider) with LazyLogging {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(state: CreatePaymentMethodState, context: Context, services: Services) = {
    logger.debug(s"CreatePaymentMethod state: $state")
    val paymentMethod = state.paymentFields match {
      case Left(stripe) => createStripePaymentMethod(stripe, services.stripeService)
      case Right(payPal) => createPayPalPaymentMethod(payPal, services.payPalService)
    }
    paymentMethod.map(CreateSalesforceContactState(state.requestId, state.user, state.contribution, _))
  }

  def createStripePaymentMethod(stripe: StripePaymentFields, stripeService: StripeService): Future[CreditCardReferenceTransaction] = for {
    stripeCustomer <- stripeService.createCustomer(stripe.userId, stripe.stripeToken).andThen {
      case Failure(e) => logger.warn(s"Could not create Stripe customer for user ${stripe.userId}", e)
    }
  } yield {
    val card = stripeCustomer.card
    CreditCardReferenceTransaction(card.id, stripeCustomer.id, card.last4, CountryGroup.countryByCode(card.country), card.exp_month, card.exp_year, card.`type`)
  }

  def createPayPalPaymentMethod(payPal: PayPalPaymentFields, payPalService: PayPalService): Future[PayPalReferenceTransaction] = Future {
    val payPalEmail = payPalService.retrieveEmail(payPal.baid)
    PayPalReferenceTransaction(payPal.baid, payPalEmail)
  }
}
