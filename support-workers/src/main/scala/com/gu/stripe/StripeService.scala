package com.gu.stripe

import com.gu.i18n.Currency
import com.gu.i18n.Currency.AUD
import com.gu.okhttp.RequestRunners._
import com.gu.rest.WebServiceHelper
import com.gu.support.config.StripeConfig
import com.gu.support.workers.lambdas.StateNotValidException
import com.gu.support.workers.{StripePublicKey, StripeSecretKey}
import com.gu.support.zuora.api.{PaymentGateway, StripeGatewayPaymentIntentsAUD, StripeGatewayPaymentIntentsDefault}
import com.typesafe.scalalogging.StrictLogging
import io.circe.Decoder

import scala.collection.immutable.Map.empty
import scala.concurrent.Future
import scala.reflect.ClassTag

class StripeService(val config: StripeConfig, client: FutureHttpClient, baseUrl: String = "https://api.stripe.com/v1")
    extends WebServiceHelper[StripeError] {

  // Stripe URL is the same in all environments
  val wsUrl = baseUrl
  val httpClient: FutureHttpClient = client

  def withPublicKey(stripePublicKey: StripePublicKey): StripeServiceForAccount = {
    val (stripeSecretKey, gateway) = config
      .forPublicKey(stripePublicKey)
      .getOrElse(throw StateNotValidException("not a known public key: " + stripePublicKey))
    new StripeServiceForAccount(this, stripeSecretKey, gateway)
  }

}

class StripeServiceForAccount(
    stripeService: StripeService,
    stripeSecretKey: StripeSecretKey,
    val paymentIntentGateway: PaymentGateway,
) {

  def get[A](
      endpoint: String,
      params: Map[String, String] = empty,
  )(implicit decoder: Decoder[A], errorDecoder: Decoder[StripeError], ctag: ClassTag[A]): Future[A] =
    stripeService.get[A](endpoint = endpoint, headers = getHeaders(), params = params)

  def postForm[A](
      endpoint: String,
      data: Map[String, Seq[String]],
  )(implicit decoder: Decoder[A], errorDecoder: Decoder[StripeError], ctag: ClassTag[A]): Future[A] = {
    stripeService.postForm[A](endpoint, data, getHeaders())
  }

  private def getHeaders(): Map[String, String] = {
    val authorizationHeader = "Authorization" -> s"Bearer ${stripeSecretKey.secret}"
    val versionHeader = stripeService.config.version.map("Stripe-Version" -> _)
    List(Some(authorizationHeader), versionHeader).flatten.toMap
  }

  val createCustomerFromPaymentMethod = com.gu.stripe.createCustomerFromPaymentMethod.apply(this) _

  val getPaymentMethod = com.gu.stripe.getPaymentMethod.apply(this) _

  val retrieveCheckoutSession = com.gu.stripe.retrieveCheckoutSession.apply(this) _

}
