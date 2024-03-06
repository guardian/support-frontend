package com.gu.stripe

import com.gu.i18n.Currency
import com.gu.i18n.Currency.AUD
import com.gu.okhttp.RequestRunners._
import com.gu.rest.WebServiceHelper
import com.gu.stripe.Stripe._
import io.circe.syntax._
import com.gu.support.config.{StripeAccountConfig, StripeConfig}
import com.gu.support.encoding.Codec
import com.gu.support.workers.StripePublicKey
import com.gu.support.workers.exceptions.{RetryException, RetryLimited, RetryNone, RetryUnlimited}
import com.gu.support.zuora.api.{
  PaymentGateway,
  StripeGatewayAUD,
  StripeGatewayDefault,
  StripeGatewayPaymentIntentsAUD,
  StripeGatewayPaymentIntentsDefault,
}
import io.circe.{Decoder, Json}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import com.gu.support.workers.exceptions.{RetryException, RetryLimited, RetryNone, RetryUnlimited}
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json}

import scala.concurrent.{ExecutionContext, Future}
import scala.reflect.ClassTag

class StripeService(val config: StripeConfig, client: FutureHttpClient, baseUrl: String = "https://api.stripe.com/v1")
    extends WebServiceHelper[StripeError]
    with StrictLogging {

  // Stripe URL is the same in all environments
  val wsUrl = baseUrl
  val httpClient: FutureHttpClient = client

  def withCurrency(currency: Currency): StripeServiceForCurrency = {
    logger.warn(s"DEPRECATED FALLBACK - using currency $currency to determine stripe gateway")
    val gateway = if (currency == AUD) StripeGatewayPaymentIntentsAUD else StripeGatewayPaymentIntentsDefault
    val stripeAccountConfig = config.forCurrency(Some(currency))
    new StripeServiceForCurrency(this, stripeAccountConfig, gateway)
  }

  def withPublicKey(stripePublicKey: StripePublicKey): StripeServiceForCurrency = {
    val (stripeAccountConfig, gateway) = config.forPublicKey(stripePublicKey)
    new StripeServiceForCurrency(this, stripeAccountConfig, gateway)
  }

}

class StripeServiceForCurrency(
    stripeService: StripeService,
    stripeAccountConfig: StripeAccountConfig,
    val paymentIntentGateway: PaymentGateway,
) {

  def get[A](
      endpoint: String,
  )(implicit decoder: Decoder[A], errorDecoder: Decoder[StripeError], ctag: ClassTag[A]): Future[A] =
    stripeService.get[A](endpoint, getHeaders())

  def postForm[A](
      endpoint: String,
      data: Map[String, Seq[String]],
  )(implicit decoder: Decoder[A], errorDecoder: Decoder[StripeError], ctag: ClassTag[A]): Future[A] = {
    stripeService.postForm[A](endpoint, data, getHeaders())
  }

  private def getHeaders(): Map[String, String] = {
    val authorizationHeader = "Authorization" -> s"Bearer ${stripeAccountConfig.secretKey}"
    val versionHeader = stripeService.config.version.map("Stripe-Version" -> _)
    List(Some(authorizationHeader), versionHeader).flatten.toMap
  }

  val createCustomerFromPaymentMethod = com.gu.stripe.createCustomerFromPaymentMethod.apply(this) _

  val getPaymentMethod = com.gu.stripe.getPaymentMethod.apply(this) _

}
