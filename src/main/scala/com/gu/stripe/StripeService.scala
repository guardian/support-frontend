package com.gu.stripe

import com.gu.helpers.WebServiceHelper
import com.gu.i18n.Currency
import com.gu.okhttp.RequestRunners._
import com.gu.stripe.Stripe._
import com.gu.support.config.StripeConfig

import scala.concurrent.{ExecutionContext, Future}

class StripeService(config: StripeConfig, client: FutureHttpClient, baseUrl: String = "https://api.stripe.com/v1")(implicit ec: ExecutionContext)
    extends WebServiceHelper[Stripe.StripeError] {

  // Stripe URL is the same in all environments
  val wsUrl = baseUrl
  val httpClient: FutureHttpClient = client

  def createCustomer(token: String, currency: Currency): Future[Customer] =
    postForm[Customer]("customers", Map(
      "card" -> Seq(token)
    ), getHeaders(currency))

  private def getHeaders(currency: Currency) =
    config.version.foldLeft(getAuthorizationHeader(currency)) {
      case (map, version) => map + ("Stripe-Version" -> version)
    }

  private def getAuthorizationHeader(currency: Currency) =
    Map("Authorization" -> s"Bearer ${config.forCurrency(Some(currency)).secretKey}")
}
