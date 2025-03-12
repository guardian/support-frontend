package services

import com.gu.monitoring.SafeLogging
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.stripe.StripeError
import com.gu.support.config.StripeConfigProvider
import io.circe.Decoder
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

case class CreateCheckoutSessionResponse(url: String, id: String)
class StripeCheckoutSessionService(
    val configProvider: StripeConfigProvider,
    client: WSClient,
    baseUrl: String = "https://api.stripe.com/v1",
)(implicit ec: ExecutionContext)
    extends SafeLogging {

  // Stripe URL is the same in all environments
//  val wsUrl: String = baseUrl
//  val httpClient: WSClient = client

  def createCheckoutSession()(implicit
      decoder: Decoder[CreateCheckoutSessionResponse],
      errorDecoder: Decoder[StripeError],
  ): Future[CreateCheckoutSessionResponse] = {
    val isTestUser = false
    val privateKey = configProvider.get(isTestUser).defaultAccount.secretKey

//    val data = Map(
//      "mode" -> Seq("setup"),
//      "success_url" -> Seq("https://support.thegulocal.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday"),
//      "currency" -> Seq("gbp"),
//    )
//    super.postForm[CreateCheckoutSessionResponse](
//      "/checkout/sessions",
//      data,
//      Map("Authorization" -> s"Basic ${privateKey}:"),
//    )
    client
      .url(s"$baseUrl/checkout/sessions")
      .withMethod("POST")
      .execute()
      .attemptT
  }
}
