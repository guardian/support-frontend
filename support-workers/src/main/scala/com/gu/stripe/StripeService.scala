package com.gu.stripe

import com.gu.helpers.WebServiceHelper
import com.gu.i18n.Currency
import com.gu.i18n.Currency.AUD
import com.gu.okhttp.RequestRunners._
import com.gu.stripe.Stripe._
import com.gu.support.config.StripeConfig
import com.gu.support.zuora.api.{PaymentGateway, StripeGatewayAUD, StripeGatewayDefault, StripeGatewayPaymentIntentsAUD, StripeGatewayPaymentIntentsDefault}
import io.circe.Decoder

import scala.concurrent.{ExecutionContext, Future}
import scala.reflect.ClassTag

class StripeService(val config: StripeConfig, client: FutureHttpClient, baseUrl: String = "https://api.stripe.com/v1")(implicit ec: ExecutionContext)
    extends WebServiceHelper[Stripe.StripeError] {

  // Stripe URL is the same in all environments
  val wsUrl = baseUrl
  val httpClient: FutureHttpClient = client

  def withCurrency(currency: Currency): StripeServiceForCurrency = new StripeServiceForCurrency(this, currency)

}

object StripeServiceForCurrency {

  def chargeGateway(currency: Currency): PaymentGateway = if (currency == AUD) StripeGatewayAUD else StripeGatewayDefault

  def paymentIntentGateway(currency: Currency): PaymentGateway = if (currency == AUD) StripeGatewayPaymentIntentsAUD else StripeGatewayPaymentIntentsDefault

}

class StripeServiceForCurrency(val stripeService: StripeService, currency: Currency) {
  import stripeService._

  def get[A](endpoint: String)(implicit decoder: Decoder[A], errorDecoder: Decoder[StripeError], ctag: ClassTag[A]): Future[A] =
    stripeService.get[A](endpoint, getHeaders())

  def postForm[A](
    endpoint: String,
    data: Map[String, Seq[String]]
  )(implicit decoder: Decoder[A], errorDecoder: Decoder[StripeError], ctag: ClassTag[A]): Future[A] = {
    stripeService.postForm[A](endpoint, data, getHeaders())
  }

  private def getHeaders() =
    config.version.foldLeft(getAuthorizationHeader()) {
      case (map, version) => map + ("Stripe-Version" -> version)
    }

  private def getAuthorizationHeader() =
    Map("Authorization" -> s"Bearer ${config.forCurrency(Some(currency)).secretKey}")

  val createCustomerFromPaymentMethod = com.gu.stripe.createCustomerFromPaymentMethod.apply(this)_

  val createCustomerFromToken = com.gu.stripe.createCustomerFromToken.apply(this)_

  val getPaymentMethod = com.gu.stripe.getPaymentMethod.apply(this)_

}
