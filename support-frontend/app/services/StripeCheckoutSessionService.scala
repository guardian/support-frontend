package services

import cats.data.EitherT
import cats.implicits.{catsSyntaxApplicativeError, toBifunctorOps}
import com.gu.i18n.Currency
import com.gu.monitoring.SafeLogging
import com.gu.support.config.StripeConfigProvider
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
      email: String,
      currency: Currency,
      isTestUser: Boolean,
      successUrl: String,
  ): EitherT[Future, String, CreateCheckoutSessionResponseSuccess] = {
    val privateKey = getPrivateKey(isTestUser)

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

  def retrieveCheckoutSession(
      id: String,
  ): EitherT[Future, String, RetrieveCheckoutSessionResponseSuccess] = {
    val isTestUser = false
    val privateKey = getPrivateKey(isTestUser)

    client
      .url(s"$baseUrl/checkout/sessions/$id?expand[]=setup_intent.payment_method")
      // Note: auth is done via basic auth. See https://docs.stripe.com/api/authentication
      .withAuth(privateKey, "", WSAuthScheme.BASIC)
      .withMethod("GET")
      .execute()
      .attemptT
      .leftMap(error => error.getMessage)
      .subflatMap(decodeResponse[RetrieveCheckoutSessionResponseSuccess])
  }

  private def getPrivateKey(isTestUser: Boolean): String = {
    // TODO: take a public key and map to a secret key instead of hardcoding this
    configProvider.get(isTestUser).defaultAccount.secretKey.secret
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
        val uriExistingFragmentRemoved =
          new java.net.URI(uri.getScheme, uri.getHost, uri.getPath, uri.getRawQuery, null).toString
        // Not adding the fragment in the URI constructor as it gets escaped which we don't want
        Some(s"$uriExistingFragmentRemoved#{CHECKOUT_SESSION_ID}")
      }
    } catch {
      case _: java.net.URISyntaxException => None
    }
  }
}
