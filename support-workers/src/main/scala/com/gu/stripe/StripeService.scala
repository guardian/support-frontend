package com.gu.stripe

import com.gu.helpers.WebServiceHelper
import com.gu.i18n.Currency
import com.gu.okhttp.RequestRunners._
import com.gu.stripe.Stripe._
import com.gu.support.config.StripeConfig

import scala.concurrent.{ExecutionContext, Future}

class StripeService(val config: StripeConfig, client: FutureHttpClient, baseUrl: String = "https://api.stripe.com/v1")(implicit ec: ExecutionContext)
    extends WebServiceHelper[Stripe.StripeError] {

  // Stripe URL is the same in all environments
  val wsUrl = baseUrl
  val httpClient: FutureHttpClient = client
}

case class StripeServiceForCurrency(stripeService: StripeService, currency: Currency) {
  import stripeService._

  def createCustomerFromToken(token: String): Future[Customer] =
    postForm[Customer]("customers", Map(
      "source" -> Seq(token)
    ), getHeaders())

  def createCustomerFromPaymentMethod(paymentMethod: String): Future[Customer] =
    postForm[Customer]("customers", Map(
      "payment_method" -> Seq(paymentMethod)
    ), getHeaders())

  private def getHeaders() =
    config.version.foldLeft(getAuthorizationHeader()) {
      case (map, version) => map + ("Stripe-Version" -> version)
    }

  private def getAuthorizationHeader() =
    Map("Authorization" -> s"Bearer ${config.forCurrency(Some(currency)).secretKey}")

}