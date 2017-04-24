package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.i18n.CountryGroup
import com.gu.okhttp.RequestRunners
import com.gu.paypal.PayPalService
import com.gu.stripe.StripeService
import com.gu.support.workers.model.{PayPalPaymentFields, StripePaymentFields}
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto.exportEncoder
import com.gu.support.workers.encoding.PaymentFieldsDecoder.decodePaymentFields
import com.gu.zuora.soap.model.{CreditCardReferenceTransaction, PayPalReferenceTransaction, PaymentMethod}

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.Failure


class CreatePaymentMethod extends FutureHandler[Either[StripePaymentFields, PayPalPaymentFields], PaymentMethod] with LazyLogging {

  val stripeService = new StripeService(Configuration.stripeConfig, RequestRunners.configurableFutureRunner(10.seconds))
  val payPalService = new PayPalService(Configuration.payPalConfig)

  override protected def handlerFuture(paymentFields: Either[StripePaymentFields, PayPalPaymentFields], context: Context) = {
    logger.info(s"paymentFields: $paymentFields")
    paymentFields match {
      case Left(stripe) => createStripePaymentMethod(stripe)
      case Right(payPal) => createPayPalPaymentMethod(payPal)
    }
  }

  def createStripePaymentMethod(stripe: StripePaymentFields) = for {
    stripeCustomer <- stripeService.Customer.create(stripe.userId, stripe.stripeToken).andThen {
      case Failure(e) => logger.warn(s"Could not create Stripe customer for user ${stripe.userId}", e)
    }
  } yield {
    val card = stripeCustomer.card
    CreditCardReferenceTransaction(card.id, stripeCustomer.id, card.last4, CountryGroup.countryByCode(card.country), card.exp_month, card.exp_year, card.`type`)
  }

  def createPayPalPaymentMethod(payPal: PayPalPaymentFields) = Future{
    val payPalEmail = payPalService.retrieveEmail(payPal.baid)
    PayPalReferenceTransaction(payPal.baid, payPalEmail)
  }
}
