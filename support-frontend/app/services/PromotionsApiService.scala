package services

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.support.config.PromotionsApiConfig
import com.gu.support.promotions.Promotion
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

import scala.concurrent.{ExecutionContext, Future}

case class PromotionsApiServiceError(message: String) extends Throwable
object PromotionsApiServiceError {
  implicit val decoder: Decoder[PromotionsApiServiceError] = deriveDecoder
}

case class ListPromotionsResponse(promotions: List[Promotion])
object ListPromotionsResponse {
  implicit val decoder: Decoder[ListPromotionsResponse] = deriveDecoder
}

/** A thin client for a single `promotions-api` (guardian/support-service-lambdas) backend environment - the replacement
  * for the legacy Zuora-catalog-embedded promotions used by [[com.gu.support.promotions.PromotionService]].
  *
  * Reuses the existing [[Promotion]] domain model/decoder, since the new API's response fields are a compatible subset
  * of the legacy Zuora-embedded shape.
  */
class PromotionsApiService(client: FutureHttpClient, config: PromotionsApiConfig)(implicit
    ec: ExecutionContext,
) extends WebServiceHelper[PromotionsApiServiceError] {
  override val httpClient: FutureHttpClient = client
  override val wsUrl: String = config.url
  override val verboseLogging: Boolean = false

  // The API caps promoCodes at 100 per request - this should never happen given our current usage.
  private val maxPromoCodesPerRequest = 100

  def listByPromoCodes(promoCodes: Seq[String], active: Boolean = true): Future[List[Promotion]] = {
    val distinctCodes = promoCodes.distinct
    require(
      distinctCodes.size <= maxPromoCodesPerRequest,
      s"Requested ${distinctCodes.size} promo codes, but promotions-api caps requests at $maxPromoCodesPerRequest",
    )
    if (distinctCodes.isEmpty) Future.successful(Nil)
    else
      get[ListPromotionsResponse](
        endpoint = "promotions",
        headers = Map("x-api-key" -> config.apiKey),
        params = Map(
          "promoCodes" -> distinctCodes.mkString(","),
          "active" -> active.toString,
        ),
      ).map(_.promotions)
  }
}
