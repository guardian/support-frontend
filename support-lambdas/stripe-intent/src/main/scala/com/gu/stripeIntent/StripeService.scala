package com.gu.stripeIntent

import com.gu.okhttp.RequestRunners._
import com.gu.rest.WebServiceHelper
import com.gu.stripe.StripeError
import io.circe.Decoder

import scala.concurrent.{ExecutionContext, Future}
import scala.reflect.ClassTag

class StripeService(
    val config: StripePrivateKey,
    client: FutureHttpClient,
    baseUrl: String = "https://api.stripe.com/v1",
)(implicit ec: ExecutionContext)
    extends WebServiceHelper[StripeError] {

  // Stripe URL is the same in all environments
  val wsUrl: String = baseUrl
  val httpClient: FutureHttpClient = client

  def postForm[A](
      endpoint: String,
      data: Map[String, Seq[String]],
  )(implicit decoder: Decoder[A], errorDecoder: Decoder[StripeError], ctag: ClassTag[A]): Future[A] = {
    super.postForm[A](endpoint, data, Map("Authorization" -> s"Bearer ${config.value}"))
  }
}
