package com.gu.patrons.services

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.patrons.conf.PatronsStripeConfig
import com.gu.patrons.model.{StripeError, StripeSubscriptionsResponse}
import com.gu.rest.WebServiceHelper

import scala.concurrent.{ExecutionContext, Future}

class PatronsStripeService(val config: PatronsStripeConfig, client: FutureHttpClient)(implicit
    ec: ExecutionContext,
) extends WebServiceHelper[StripeError] {
  override val wsUrl = "https://api.stripe.com/v1"
  override val httpClient = client
  val authHeader = Map(
    "Authorization" -> s"Bearer ${config.apiKey}",
  )

  def getSubscriptions(
      pageSize: Int = 10,
      startingAfterId: Option[String] = None,
      status: String = "active",
  ): Future[StripeSubscriptionsResponse] = {
    val startingAfter = startingAfterId.map(id => Map("starting_after" -> id))
    get[StripeSubscriptionsResponse](
      s"subscriptions",
      authHeader,
      Map(
        "expand[]" -> "data.customer",
        "status" -> status,
        "limit" -> pageSize.toString,
      ) ++ startingAfter.getOrElse(Nil),
    )
  }

}
