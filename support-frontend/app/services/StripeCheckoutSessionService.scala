package services

import cats.data.EitherT
import cats.implicits.{catsSyntaxApplicativeError, toBifunctorOps}
import com.gu.monitoring.SafeLogging
import com.gu.support.config.StripeConfigProvider
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import play.api.libs.ws.{WSAuthScheme, WSClient, WSResponse}
import io.circe.parser.decode

import scala.concurrent.{ExecutionContext, Future}

sealed trait CreateCheckoutSessionResponseError[+A]
object CreateCheckoutSessionResponseError {
  case class DecodingError(error: io.circe.Error) extends CreateCheckoutSessionResponseError[Nothing]
  case class ExecuteError(error: Throwable) extends CreateCheckoutSessionResponseError[Nothing]
  case class APIError[A](error: A) extends CreateCheckoutSessionResponseError[A]
}

case class CreateCheckoutSessionResponseSuccess(url: String, id: String)
object CreateCheckoutSessionResponseSuccess {
  implicit val decoder: Decoder[CreateCheckoutSessionResponseSuccess] = deriveDecoder
}

case class CreateCheckoutSessionError(responseCode: Option[Int], errorName: Option[String], message: String)

object CreateCheckoutSessionError {
  implicit val decoder: Decoder[CreateCheckoutSessionError] = deriveDecoder
}

class StripeCheckoutSessionService(
    val configProvider: StripeConfigProvider,
    client: WSClient,
    baseUrl: String = "https://api.stripe.com/v1",
)(implicit ec: ExecutionContext)
    extends SafeLogging {

  // Stripe URL is the same in all environments
//  val wsUrl: String = baseUrl
//  val httpClient: WSClient = client

  def createCheckoutSession(): EitherT[Future, CreateCheckoutSessionResponseError[
    CreateCheckoutSessionError,
  ], CreateCheckoutSessionResponseSuccess] = {
    val isTestUser = false
    val privateKey = configProvider.get(isTestUser).defaultAccount.secretKey

    val data = Map(
      "mode" -> Seq("setup"),
      "success_url" -> Seq("https://support.thegulocal.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday"),
      "currency" -> Seq("gbp"),
    )
    client
      .url(s"$baseUrl/checkout/sessions")
      .withAuth(privateKey.secret, "", WSAuthScheme.BASIC)
      .withMethod("POST")
      // https: //www.playframework.com/documentation/3.0.x/ScalaWS#Submitting-form-data
      .withBody(data)
      .execute()
      .attemptT
      .leftMap(CreateCheckoutSessionResponseError.ExecuteError)
      .subflatMap(decodeCreateCheckoutSessionResponse[CreateCheckoutSessionError, CreateCheckoutSessionResponseSuccess])
  }

  def decodeCreateCheckoutSessionResponse[A: Decoder, B: Decoder](
      response: WSResponse,
  ): Either[CreateCheckoutSessionResponseError[A], B] = {
    implicit def paymentAPIResponseDecoder: Decoder[Either[A, B]] = Decoder.decodeEither[A, B]("error", "data")

    decode[Either[A, B]](response.body).fold(
      err => Left(CreateCheckoutSessionResponseError.DecodingError(err)),
      response => response.leftMap(err => CreateCheckoutSessionResponseError.APIError(err)),
    )
  }
}
