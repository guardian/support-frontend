package com.gu.stripe

import com.gu.helpers.WebServiceHelper
import com.gu.i18n.Country
import com.gu.okhttp.RequestRunners._
import com.gu.stripe.Stripe._
import com.gu.support.config.StripeConfig

import scala.concurrent.{ExecutionContext, Future}

class StripeService(config: StripeConfig, client: FutureHttpClient, baseUrl: String = "https://api.stripe.com/v1")(implicit ec: ExecutionContext)
    extends WebServiceHelper[Stripe.StripeError] {

  // Stripe URL is the same in all environments
  val wsUrl = baseUrl
  val httpClient: FutureHttpClient = client

  def createCustomer(description: String, card: String, country: Country): Future[Customer] =
    postForm[Customer]("customers", Map(
      "description" -> Seq(description),
      "card" -> Seq(card)
    ), getHeaders(country))

  private def getHeaders(country: Country) =
    config.version.foldLeft(getAuthorizationHeader(country)) {
      case (map, version) => map + ("Stripe-Version" -> version)
    }

  private def getAuthorizationHeader(country: Country) = {
    Map("Authorization" -> s"Bearer ${config.forCountry(Some(country)).secretKey}")
  }
}
