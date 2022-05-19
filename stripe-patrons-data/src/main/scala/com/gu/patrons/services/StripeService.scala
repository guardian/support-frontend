package com.gu.patrons.services

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.patrons.conf.StripePatronsConfig
import com.gu.patrons.model.{StripeError, StripeSubscriptionsResponse}
import com.gu.rest.WebServiceHelper

import scala.concurrent.{ExecutionContext, Future}

class StripeService(val config: StripePatronsConfig, client: FutureHttpClient)(implicit
    ec: ExecutionContext,
) extends WebServiceHelper[StripeError] {
  override val wsUrl = "https://api.stripe.com/v1"
  override val httpClient = client
  val authHeader = Map(
    "Authorization" -> s"Bearer ${config.apiKey}",
  )

  def getSubscriptions(): Future[StripeSubscriptionsResponse] =
    get[StripeSubscriptionsResponse](s"subscriptions", authHeader, Map("expand[]" -> "data.customer"))
}
object StripeService {}
