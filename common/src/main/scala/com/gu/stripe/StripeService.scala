package com.gu.stripe

import com.gu.helpers.WebServiceHelper
import com.gu.okhttp.RequestRunners._
import com.gu.stripe.Stripe._
import com.gu.support.config.StripeConfig
import okhttp3.Request

import scala.concurrent.{ExecutionContext, Future}

class StripeService(config: StripeConfig, client: FutureHttpClient, baseUrl: String = "https://api.stripe.com/v1")(implicit ec: ExecutionContext)
    extends WebServiceHelper[Stripe.StripeError] {

  // Stripe URL is the same in all environments
  val wsUrl = baseUrl
  val httpClient: FutureHttpClient = client

  override def wsPreExecute(req: Request.Builder): Request.Builder =
    req.addHeader("Authorization", s"Bearer ${config.secretKey}")

  def createCustomer(description: String, card: String): Future[Customer] =
    post[Customer]("customers", Map(
      "description" -> Seq(description),
      "card" -> Seq(card)
    ))

  def readCustomer(customerId: String): Future[Customer] =
    get[Customer](s"customers/$customerId")

  def updateCard(customerId: String, card: String): Future[Customer] =
    post[Customer](s"customers/$customerId", Map("card" -> Seq(card)))

}
