package com.gu.patrons.services

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.patrons.conf.PatronsStripeConfig
import com.gu.patrons.model.{ExpandedStripeCustomer, StripeError, StripeSubscriptionsResponse}
import com.gu.rest.WebServiceHelper

import scala.concurrent.{ExecutionContext, Future}

class PatronsStripeService(val config: PatronsStripeConfig, client: FutureHttpClient)(implicit
    ec: ExecutionContext,
) extends WebServiceHelper[StripeError] {
  override val wsUrl = "https://api.stripe.com/v1"
  override val httpClient = client

  def authHeader(account: PatronsStripeAccount): Map[String, String] = Map(
    "Authorization" -> s"Bearer ${account match {
        case GnmPatronScheme => config.apiKey
        case GnmPatronSchemeAus => config.apiKeyAu
      }}",
  )

  def getSubscriptions(
      account: PatronsStripeAccount,
      pageSize: Int = 10,
      startingAfterId: Option[String] = None,
      status: String = "active",
  ): Future[StripeSubscriptionsResponse] = {
    val startingAfter = startingAfterId.map(id => Map("starting_after" -> id))
    get[StripeSubscriptionsResponse](
      s"subscriptions",
      authHeader(account),
      Map(
        "expand[]" -> "data.customer",
        "status" -> status,
        "limit" -> pageSize.toString,
      ) ++ startingAfter.getOrElse(Nil),
    )
  }

  def getCustomer(account: PatronsStripeAccount, customerId: String) =
    get[ExpandedStripeCustomer](
      s"customers/$customerId",
      authHeader(account),
    )

}

sealed trait PatronsStripeAccount

case object GnmPatronScheme extends PatronsStripeAccount
case object GnmPatronSchemeAus extends PatronsStripeAccount
