package services

import cats.data.EitherT
import cats.implicits.{catsSyntaxApplicativeError, toBifunctorOps}
import com.gu.i18n.Currency
import com.gu.monitoring.SafeLogging
import com.gu.support.config.StripeConfigProvider
import com.gu.support.workers.StripePublicKey
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import play.api.libs.ws.{WSAuthScheme, WSClient, WSResponse}
import io.circe.parser.decode

import scala.concurrent.{ExecutionContext, Future}

sealed trait ResponseError
object ResponseError {
  case class DecodingError(error: io.circe.Error) extends ResponseError
  case class ExecuteError(error: Throwable) extends ResponseError
}

case class CreateCheckoutSessionResponseSuccess(url: String, id: String)
object CreateCheckoutSessionResponseSuccess {
  implicit val decoder: Decoder[CreateCheckoutSessionResponseSuccess] = deriveDecoder
}

case class CheckoutPaymentMethod(id: String)
object CheckoutPaymentMethod {
  implicit val decoder: Decoder[CheckoutPaymentMethod] = deriveDecoder
}
case class CheckoutSetupIntent(id: String, payment_method: CheckoutPaymentMethod)
object CheckoutSetupIntent {
  implicit val decoder: Decoder[CheckoutSetupIntent] = deriveDecoder
}
case class RetrieveCheckoutSessionResponseSuccess(setup_intent: CheckoutSetupIntent)
object RetrieveCheckoutSessionResponseSuccess {
  implicit val decoder: Decoder[RetrieveCheckoutSessionResponseSuccess] = deriveDecoder
}

class StripeCheckoutSessionService(
    configProvider: StripeConfigProvider,
    client: WSClient,
)(implicit ec: ExecutionContext)
    extends SafeLogging {
  val baseUrl: String = "https://api.stripe.com/v1"

  def createCheckoutSession(
      stripePublicKey: StripePublicKey,
      email: String,
      currency: Currency,
      isTestUser: Boolean,
      successUrl: String,
  ): EitherT[Future, String, CreateCheckoutSessionResponseSuccess] = {
    val privateKey = getPrivateKey(stripePublicKey, isTestUser)

    // We use the default expiration of 24 hours
    val data = Map(
      "mode" -> Seq("setup"),
      "success_url" -> Seq(successUrl),
      "currency" -> Seq(currency.iso.toLowerCase),
      "payment_method_types[]" -> Seq("card"),
      "customer_email" -> Seq(email),
    )

    client
      .url(s"$baseUrl/checkout/sessions")
      // Note: auth is done via basic auth. See https://docs.stripe.com/api/authentication
      .withAuth(privateKey, "", WSAuthScheme.BASIC)
      .withMethod("POST")
      // https: //www.playframework.com/documentation/3.0.x/ScalaWS#Submitting-form-data
      .withBody(data)
      .execute()
      .attemptT
      .leftMap(error => error.getMessage)
      .subflatMap(decodeResponse[CreateCheckoutSessionResponseSuccess])
  }

  private def getPrivateKey(stripePublicKey: StripePublicKey, isTestUser: Boolean) = {
    configProvider.get(isTestUser).forPublicKey(stripePublicKey) match {
      case Some(config) => config._1.secret
      case None =>
        throw new RuntimeException(s"Stripe public key $stripePublicKey not found in config")
    }
  }

  private def decodeResponse[A: Decoder](
      response: WSResponse,
  ): Either[String, A] = {
    decode[A](response.body).leftMap(_ => "Decode error")
  }
}

object StripeCheckoutSessionService {
  val ALLOWED_SUCCESS_DOMAINS = List(
    "support.theguardian.com",
    "support.code.dev-theguardian.com",
    "support.thegulocal.com",
  )

  def buildSuccessUrl(refererUrl: String): Option[String] = {
    try {
      val uri = new java.net.URI(refererUrl)

      if (uri.getScheme != "https" || !ALLOWED_SUCCESS_DOMAINS.contains(uri.getHost)) {
        None
      } else {
        val existingQuery = uri.getQuery
        val newQuery =
          if (existingQuery != "") s"$existingQuery&__CHECKOUT_SESSION_ID_PLACEHOLDER__"
          else "__CHECKOUT_SESSION_ID_PLACEHOLDER__"

        val successUrlWithPlaceholder =
          new java.net.URI(uri.getScheme, uri.getHost, uri.getPath, newQuery, uri.getFragment).toString

        // We add the checkout session ID placeholder after the URI build to avoid escaping, which we don't want
        val qsa = "checkoutSessionId={CHECKOUT_SESSION_ID}"
        val successUrl = successUrlWithPlaceholder.replace("__CHECKOUT_SESSION_ID_PLACEHOLDER__", qsa)

        Some(successUrl)
      }
    } catch {
      case _: java.net.URISyntaxException => None
    }
  }
}
