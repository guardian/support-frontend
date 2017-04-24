package com.gu.stripe

import cats.syntax.option._
import com.gu.i18n.Currency
import com.gu.okhttp.RequestRunners._
import com.gu.stripe.Stripe._
import com.gu.support.workers.helpers.WebServiceHelper
import io.circe.generic.auto._
import okhttp3.Request

import scala.concurrent.{ExecutionContext, Future}

class StripeService(config: StripeConfig, client: FutureHttpClient)(implicit ec: ExecutionContext) extends WebServiceHelper[StripeObject, Stripe.Error] {
  val wsUrl = "https://api.stripe.com/v1" // Stripe URL is the same in all environments
  val publicKey = config.publicKey
  val httpClient: FutureHttpClient = client

  override def wsPreExecute(req: Request.Builder): Request.Builder =
    req.addHeader("Authorization", s"Bearer ${config.secretKey}")

  object Customer {
    def create(description: String, card: String): Future[Customer] =
      post[Customer]("customers", Map(
        "description" -> Seq(description),
        "card" -> Seq(card)))

    def read(customerId: String): Future[Customer] =
      get[Customer](s"customers/$customerId")

    def updateCard(customerId: String, card: String): Future[Customer] =
      post[Customer](s"customers/$customerId", Map("card" -> Seq(card)))
  }

  object Charge {
    def create(amount: Int, currency: Currency, email: String, description: String, cardToken: String, meta: Map[String, String]) =
      post[Charge]("charges", Map(
        "currency" -> Seq(currency.toString),
        "description" -> Seq(description),
        "amount" -> Seq(amount.toString),
        "receipt_email" -> Seq(email),
        "source" -> Seq(cardToken)
      ) ++ meta.map { case (k, v) => s"metadata[$k]" -> Seq(v) })
  }

  object BalanceTransaction {
    def find(id: String): Future[Stripe.BalanceTransaction] =
      get[BalanceTransaction](id)

    def read(balanceId: String) = {
      find("balance/history/" + balanceId).map(_.some.collect {
        case b: Stripe.BalanceTransaction => b
      })
    }
  }
}
