package com.gu.stripeIntent

import com.gu.okhttp.RequestRunners._
import com.gu.rest.WebServiceHelper
import com.gu.support.encoding.Codec
import com.gu.support.workers.exceptions.{RetryException, RetryLimited, RetryNone, RetryUnlimited}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Json}

import scala.concurrent.{ExecutionContext, Future}
import scala.reflect.ClassTag

class StripeService(val config: StripePrivateKey, client: FutureHttpClient, baseUrl: String = "https://api.stripe.com/v1")(implicit ec: ExecutionContext)
  extends WebServiceHelper[StripeError] {

  // Stripe URL is the same in all environments
  val wsUrl = baseUrl
  val httpClient: FutureHttpClient = client

  def get[A](endpoint: String)(implicit decoder: Decoder[A], errorDecoder: Decoder[StripeError], ctag: ClassTag[A]): Future[A] =
    super.get[A](endpoint, getHeaders())

  def postForm[A](
    endpoint: String,
    data: Map[String, Seq[String]]
  )(implicit decoder: Decoder[A], errorDecoder: Decoder[StripeError], ctag: ClassTag[A]): Future[A] = {
    super.postForm[A](endpoint, data, getHeaders())
  }

  private def getHeaders() =
    Map("Authorization" -> s"Bearer ${config.value}")

}

object StripeError {
  private val encoder = deriveEncoder[StripeError].mapJson { json => Json.fromFields(List("error" -> json)) }

  private val decoder = deriveDecoder[StripeError].prepare { _.downField("error") }

  implicit val codec: Codec[StripeError] = new Codec[StripeError](encoder, decoder)
}

//See docs here: https://stripe.com/docs/api/curl#errors
case class StripeError(
  `type`: String, //The type of error: api_connection_error, api_error, authentication_error, card_error, invalid_request_error, or rate_limit_error
  message: String, //A human-readable message providing more details about the error. For card errors, these messages can be shown to your users.
  code: Option[String] = None, //For card errors, a short string from amongst those listed on the right describing the kind of card error that occurred.
  decline_code: Option[String] = None, //For card errors resulting from a bank decline, a short string indicating the bank's reason for the decline.
  param: Option[String] = None //The parameter the error relates to if the error is parameter-specific..
) extends Throwable {

  override def getMessage: String =
    s"message: $message; type: ${`type`}; code: ${code.getOrElse("")}; decline_code: ${decline_code.getOrElse("")}; param: ${param.getOrElse("")}"

  def asRetryException: RetryException = `type` match {
    case ("api_connection_error" | "api_error" | "rate_limit_error") => new RetryUnlimited(this.asJson.noSpaces, cause = this)
    case "authentication_error" => new RetryLimited(this.asJson.noSpaces, cause = this)
    case ("card_error" | "invalid_request_error" | "validation_error") => new RetryNone(this.asJson.noSpaces, cause = this)
  }
}
