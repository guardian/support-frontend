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

sealed trait CheckoutSessionResponseError
object CheckoutSessionResponseError {
  case class DecodingError(error: io.circe.Error) extends CheckoutSessionResponseError
  case class ExecuteError(error: Throwable) extends CheckoutSessionResponseError
}

case class CreateCheckoutSessionResponseSuccess(url: String, id: String)
object CreateCheckoutSessionResponseSuccess {
  implicit val decoder: Decoder[CreateCheckoutSessionResponseSuccess] = deriveDecoder
}

case class RetrieveCheckoutSessionResponseSuccess(setup_intent: String)
object RetrieveCheckoutSessionResponseSuccess {
  implicit val decoder: Decoder[RetrieveCheckoutSessionResponseSuccess] = deriveDecoder
}

class StripeCheckoutSessionService(
    configProvider: StripeConfigProvider,
    client: WSClient,
)(implicit ec: ExecutionContext)
    extends SafeLogging {
  val baseUrl: String = "https://api.stripe.com/v1"

  def createCheckoutSession(): EitherT[Future, CheckoutSessionResponseError, CreateCheckoutSessionResponseSuccess] = {
    val isTestUser = false
    val privateKey = configProvider.get(isTestUser).defaultAccount.secretKey

    val data = Map(
      "mode" -> Seq("setup"),
      "success_url" -> Seq("https://support.thegulocal.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday"),
      "currency" -> Seq("gbp"),
      "payment_method_types[]" -> Seq("card"),
      // Email should be provided by the client as we'll have collected it on the payment form
      "customer_email" -> Seq(
        "test@theguardian.com",
      ),
    )
    client
      .url(s"$baseUrl/checkout/sessions")
      .withAuth(privateKey.secret, "", WSAuthScheme.BASIC)
      .withMethod("POST")
      // https: //www.playframework.com/documentation/3.0.x/ScalaWS#Submitting-form-data
      .withBody(data)
      .execute()
      .attemptT
      .leftMap(CheckoutSessionResponseError.ExecuteError)
      .subflatMap(decodeCreateCheckoutSessionResponse)
  }

  private def decodeCreateCheckoutSessionResponse(
      response: WSResponse,
  ): Either[CheckoutSessionResponseError, CreateCheckoutSessionResponseSuccess] = {
    // TODO: remove this logging
    logger.error(scrub"Create checkout response: ${response.body}")

    decode[CreateCheckoutSessionResponseSuccess](response.body).leftMap(
      CheckoutSessionResponseError.DecodingError,
    )
  }

  def retrieveCheckoutSession(
      id: String,
  ): EitherT[Future, CheckoutSessionResponseError, RetrieveCheckoutSessionResponseSuccess] = {
    val isTestUser = false
    val privateKey = configProvider.get(isTestUser).defaultAccount.secretKey

    client
      .url(s"$baseUrl/checkout/sessions/$id")
      .withAuth(privateKey.secret, "", WSAuthScheme.BASIC)
      .withMethod("GET")
      .execute()
      .attemptT
      .leftMap(CheckoutSessionResponseError.ExecuteError)
      .subflatMap(decodeRetrieveCheckoutSessionResponse)
  }

  private def decodeRetrieveCheckoutSessionResponse(
      response: WSResponse,
  ): Either[CheckoutSessionResponseError, RetrieveCheckoutSessionResponseSuccess] = {
    // TODO: remove this logging
    logger.error(scrub"Retrieve checkout response: ${response.body}")

    decode[RetrieveCheckoutSessionResponseSuccess](response.body).leftMap(
      CheckoutSessionResponseError.DecodingError,
    )
  }
}
