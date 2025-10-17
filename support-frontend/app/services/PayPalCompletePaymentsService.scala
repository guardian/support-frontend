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

case class CreateSetupTokenRequest()
object CreateSetupTokenRequest {
  implicit val codec: Codec[CreateSetupTokenRequest] = deriveCodec
}

case class CreateSetupTokenResponse()
object CreateSetupTokenResponse {
  implicit val codec: Codec[CreateSetupTokenResponse] = deriveCodec
}

case class PayPalCompletePaymentsError(Message: String) extends Throwable(s"$Message")
object PayPalCompletePaymentsError {
  implicit val codec: Codec[PayPalCompletePaymentsError] = deriveCodec
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

  def createSetupToken: Future[CreateSetupTokenResponse] = {
    val payload = CreateSetupTokenRequest()
    for {
      getAccessTokenResponse <- postForm[GetAccessTokenResponse](
        endpoint = "/v1/oauth2/token",
        data = Map("grant_type" -> List("client_credentials")),
        headers = Map(
          "Authorization" -> ("Basic " + java.util.Base64.getEncoder.encodeToString("CLIENT_ID:CLIENT_SECRET".getBytes)),
        ),
      )
      tokenResponse <- postJson[CreateSetupTokenResponse](
        endpoint = "/v3/vault/setup-tokens",
        data = payload.asJson,
        headers = buildAuthorization(getAccessTokenResponse.access_token),
      )
    } yield tokenResponse

  }
}
