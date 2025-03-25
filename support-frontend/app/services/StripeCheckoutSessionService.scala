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
  val expirationMillis = 30 * 60 * 1000 // 30 minutes in millis

  def createCheckoutSession(
      email: String,
      currency: Currency,
      isTestUser: Boolean,
  ): EitherT[Future, String, CreateCheckoutSessionResponseSuccess] = {
    val privateKey = getPrivateKey(isTestUser)

    val data = Map(
      "mode" -> Seq("setup"),
      "success_url" -> Seq("https://support.thegulocal.com/stripe/complete-checkout-session/{CHECKOUT_SESSION_ID}"),
      "currency" -> Seq(currency.toString.toLowerCase), // Is this the format Stripe expect?
      "payment_method_types[]" -> Seq("card"),
      "customer_email" -> Seq(email),
      "expires_at" -> Seq((Math.round((System.currentTimeMillis() + expirationMillis) / 1000)).toString),
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
