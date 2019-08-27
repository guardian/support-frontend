package com.gu.stripe

import com.gu.helpers.WebServiceHelper
import com.gu.i18n.Currency
import com.gu.okhttp.RequestRunners._
import com.gu.stripe.Stripe._
import com.gu.support.config.StripeConfig
import io.circe.Decoder

import scala.concurrent.{ExecutionContext, Future}
import scala.reflect.ClassTag

class StripeService(config: StripeConfig, client: FutureHttpClient, baseUrl: String = "https://api.stripe.com/v1")(implicit ec: ExecutionContext)
    extends WebServiceHelper[Stripe.StripeError] {

  // Stripe URL is the same in all environments
  val wsUrl = baseUrl
  val httpClient: FutureHttpClient = client

  def withCurrency(currency: Currency): WithCurrency = new WithCurrency(currency)
  class WithCurrency(currency: Currency) {

    def post[A](
      endpoint: String,
      data: Map[String, Seq[String]]
    )(implicit decoder: Decoder[A], errorDecoder: Decoder[StripeError], ctag: ClassTag[A]): Future[A] =
      StripeService.super.postForm[A](endpoint, data, getHeaders())

    private def getHeaders() =
      config.version.foldLeft(getAuthorizationHeader()) {
        case (map, version) => map + ("Stripe-Version" -> version)
      }

    private def getAuthorizationHeader() =
      Map("Authorization" -> s"Bearer ${config.forCurrency(Some(currency)).secretKey}")

  }
}

object CreateCustomer {
  // https://stripe.com/docs/api/customers/create

  def fromSource(token: String): StripeService#WithCurrency => Future[Customer] =
    _.post[Customer]("customers", Map(
      "source" -> Seq(token)
    ))

  def fromPaymentMethod(token: String): StripeService#WithCurrency => Future[Customer] =
    _.post[Customer]("customers", Map(
      "payment_method" -> Seq(token)
    ))

}
