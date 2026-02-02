package services

import com.gu.monitoring.SafeLogging
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.support.config.PayPalCompletePaymentsConfig
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.touchpoint.TouchpointService
import io.circe.syntax.EncoderOps

import scala.concurrent.{ExecutionContext, Future}

case class GetAccessTokenResponse(access_token: String)
object GetAccessTokenResponse {
  implicit val codec: Codec[GetAccessTokenResponse] = deriveCodec
}

case class ExperienceContext(
    return_url: String = "https://support.thegulocal.com",
    cancel_url: String = "https://support.thegulocal.com",
    shipping_preference: String = "NO_SHIPPING",
)
object ExperienceContext {
  implicit val codec: Codec[ExperienceContext] = deriveCodec
}

case class PayPalPaymentSource(
    usage_type: String = "MERCHANT",
    customer_type: String = "CONSUMER",
    experience_context: ExperienceContext = ExperienceContext(),
)
object PayPalPaymentSource {
  implicit val codec: Codec[PayPalPaymentSource] = deriveCodec
}

case class PayPalTokenSource(id: String, `type`: String = "SETUP_TOKEN")
object PayPalTokenSource {
  implicit val codec: Codec[PayPalTokenSource] = deriveCodec
}

case class SetupPaymentSource(paypal: PayPalPaymentSource = PayPalPaymentSource())
object SetupPaymentSource {
  implicit val codec: Codec[SetupPaymentSource] = deriveCodec
}

case class CreateSetupTokenRequest(payment_source: SetupPaymentSource = SetupPaymentSource())
object CreateSetupTokenRequest {
  implicit val codec: Codec[CreateSetupTokenRequest] = deriveCodec
}

case class CreateSetupTokenResponse(id: String)
object CreateSetupTokenResponse {
  implicit val codec: Codec[CreateSetupTokenResponse] = deriveCodec
}
case class CreateTokenPayPalSource(email_address: String)
object CreateTokenPayPalSource {
  implicit val codec: Codec[CreateTokenPayPalSource] = deriveCodec
}
case class CreateTokenSource(paypal: CreateTokenPayPalSource)
object CreateTokenSource {
  implicit val codec: Codec[CreateTokenSource] = deriveCodec
}
case class CreatePaymentTokenResponse(id: String, payment_source: CreateTokenSource)
object CreatePaymentTokenResponse {
  implicit val codec: Codec[CreatePaymentTokenResponse] = deriveCodec
}

case class PaymentSource(token: PayPalTokenSource)
object PaymentSource {
  implicit val codec: Codec[PaymentSource] = deriveCodec
}

case class CreatePaymentTokenRequest(payment_source: PaymentSource)
object CreatePaymentTokenRequest {
  implicit val codec: Codec[CreatePaymentTokenRequest] = deriveCodec
}

case class PayPalCompletePaymentsError(Message: String) extends Throwable(s"$Message")
object PayPalCompletePaymentsError {
  implicit val codec: Codec[PayPalCompletePaymentsError] = deriveCodec
}

case class PaymentToken(id: String, email: String)
object PaymentToken {
  implicit val codec: Codec[PaymentToken] = deriveCodec
}

class PayPalCompletePaymentsService(config: PayPalCompletePaymentsConfig, client: FutureHttpClient)(implicit
    executionContext: ExecutionContext,
) extends TouchpointService
    with WebServiceHelper[PayPalCompletePaymentsError]
    with SafeLogging {

  override val wsUrl: String = config.baseUrl
  override val httpClient: FutureHttpClient = client

  private def buildAuthorization(accessToken: String) = {
    Map(
      "Authorization" -> s"Bearer $accessToken",
    )
  }

  private def getAccessToken: Future[String] = {
    postForm[GetAccessTokenResponse](
      endpoint = "/v1/oauth2/token",
      data = Map("grant_type" -> List("client_credentials")),
      headers = Map(
        "Authorization" -> ("Basic " + java.util.Base64.getEncoder
          .encodeToString(s"${config.clientId}:${config.clientSecret}".getBytes)),
      ),
    ).map(_.access_token)
  }

  def createSetupToken: Future[String] = {
    val payload = CreateSetupTokenRequest()
    for {
      accessToken <- getAccessToken
      setupTokenResponse <- postJson[CreateSetupTokenResponse](
        endpoint = "/v3/vault/setup-tokens",
        data = payload.asJson,
        headers = buildAuthorization(accessToken),
      )
    } yield setupTokenResponse.id
  }

  def createPaymentToken(setupToken: String): Future[PaymentToken] = {
    for {
      accessToken <- getAccessToken
      paymentTokenResponse <- postJson[CreatePaymentTokenResponse](
        endpoint = "/v3/vault/payment-tokens",
        data = CreatePaymentTokenRequest(PaymentSource(PayPalTokenSource(setupToken))).asJson,
        headers = buildAuthorization(accessToken),
      )
    } yield PaymentToken(paymentTokenResponse.id, paymentTokenResponse.payment_source.paypal.email_address)
  }
}
