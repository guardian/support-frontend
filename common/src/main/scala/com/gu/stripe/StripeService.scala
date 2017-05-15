package com.gu.stripe

import com.gu.helpers.WebServiceHelper
import com.gu.okhttp.RequestRunners._
import com.gu.stripe.Stripe._
import io.circe.generic.auto._
import okhttp3.Request

import scala.concurrent.{ExecutionContext, Future}

class StripeService(config: StripeConfig, client: FutureHttpClient)(implicit ec: ExecutionContext) extends WebServiceHelper[Stripe.Error] {
  val wsUrl = "https://api.stripe.com/v1"
  // Stripe URL is the same in all environments
  val publicKey = config.publicKey
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
