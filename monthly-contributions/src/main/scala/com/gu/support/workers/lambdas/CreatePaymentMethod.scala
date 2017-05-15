package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.i18n.CountryGroup
import com.gu.paypal.PayPalService
import com.gu.services.Services
import com.gu.stripe.StripeService
import com.gu.support.workers.encoding.CreatePaymentMethodStateDecoder.decodeCreatePaymentMethodState
import com.gu.support.workers.model.{CreatePaymentMethodState, CreateSalesforceContactState, PayPalPaymentFields, StripePaymentFields}
import com.gu.zuora.model.{CreditCardReferenceTransaction, PayPalReferenceTransaction}
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.Failure

class CreatePaymentMethod(services: Services = Services) extends FutureHandler[CreatePaymentMethodState, CreateSalesforceContactState] with LazyLogging {

  override protected def handlerFuture(state: CreatePaymentMethodState, context: Context) = {
    logger.debug(s"CreatePaymentMethod state: $state")
    val paymentMethod = state.paymentFields match {
      case Left(stripe) => createStripePaymentMethod(stripe, services.stripeService.get(state.user.isTestUser))
      case Right(payPal) => createPayPalPaymentMethod(payPal, services.payPalService.get(state.user.isTestUser))
    }
    paymentMethod.map(CreateSalesforceContactState(state.user, state.contribution, _))
  }

  def createStripePaymentMethod(stripe: StripePaymentFields, stripeService: StripeService): Future[CreditCardReferenceTransaction] = for {
    stripeCustomer <- stripeService.createCustomer(stripe.userId, stripe.stripeToken).andThen {
      case Failure(e) => logger.warn(s"Could not create Stripe customer for user ${
        stripe.userId
      }", e)
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
