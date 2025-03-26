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
  val expirationMillis = 24 * 60 * 60 * 1000 // 24 hours in millis

  def createCheckoutSession(
      email: String,
      currency: Currency,
      isTestUser: Boolean,
      successUrl: String,
  ): EitherT[Future, String, CreateCheckoutSessionResponseSuccess] = {
    val privateKey = getPrivateKey(isTestUser)

    val data = Map(
      "mode" -> Seq("setup"),
      "success_url" -> Seq(successUrl),
      "currency" -> Seq(currency.toString.toLowerCase), // Is this the format Stripe expect?
      "payment_method_types[]" -> Seq("card"),
      "customer_email" -> Seq(email),
      "expires_at" -> Seq((Math.round((System.currentTimeMillis() + expirationMillis).toFloat / 1000)).toString),
    )
    client
      .url(s"$baseUrl/checkout/sessions")
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
      .withAuth(privateKey, "", WSAuthScheme.BASIC)
      .withMethod("GET")
      .execute()
      .attemptT
      .leftMap(error => error.getMessage)
      .subflatMap(decodeResponse[RetrieveCheckoutSessionResponseSuccess])
  }

  private def getPrivateKey(isTestUser: Boolean): String = {
    configProvider.get(isTestUser).defaultAccount.secretKey.secret
  }

  private def decodeResponse[A: Decoder](
      response: WSResponse,
  ): Either[String, A] = {
    // TODO: remove this logging
    logger.error(scrub"Response: ${response.body}")

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
