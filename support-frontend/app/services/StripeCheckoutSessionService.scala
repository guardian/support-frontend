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

sealed trait CreateCheckoutSessionResponseError
object CreateCheckoutSessionResponseError {
  case class DecodingError(error: io.circe.Error) extends CreateCheckoutSessionResponseError
  case class ExecuteError(error: Throwable) extends CreateCheckoutSessionResponseError
}

case class CreateCheckoutSessionResponseSuccess(url: String, id: String)
object CreateCheckoutSessionResponseSuccess {
  implicit val decoder: Decoder[CreateCheckoutSessionResponseSuccess] = deriveDecoder
}

class StripeCheckoutSessionService(
    configProvider: StripeConfigProvider,
    client: WSClient,
)(implicit ec: ExecutionContext)
    extends SafeLogging {
  val baseUrl: String = "https://api.stripe.com/v1"

  def createCheckoutSession()
      : EitherT[Future, CreateCheckoutSessionResponseError, CreateCheckoutSessionResponseSuccess] = {
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
      .subflatMap(decodeCreateCheckoutSessionResponse)
  }

  def decodeCreateCheckoutSessionResponse(
      response: WSResponse,
  ): Either[CreateCheckoutSessionResponseError, CreateCheckoutSessionResponseSuccess] = {
    decode[CreateCheckoutSessionResponseSuccess](response.body).leftMap(
      CreateCheckoutSessionResponseError.DecodingError,
    )
  }
}
