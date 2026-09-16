package services

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.support.config.PromotionsApiConfig
import com.gu.support.promotions.PromoWithCatalogInformation
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

import scala.concurrent.{ExecutionContext, Future}

case class PromotionsApiServiceError(message: String) extends Throwable(message)
object PromotionsApiServiceError {
  implicit val decoder: Decoder[PromotionsApiServiceError] = deriveDecoder
}

case class ListPromotionsResponse(promotions: List[PromoWithCatalogInformation])
object ListPromotionsResponse {
  implicit val decoder: Decoder[ListPromotionsResponse] = deriveDecoder
}

/** A thin client for a single `promotions-api` (guardian/support-service-lambdas) backend environment - the replacement
  * for the legacy Zuora-catalog-embedded promotions used by [[com.gu.support.promotions.PromotionService]].
  *
  * Decodes responses directly into [[PromoWithCatalogInformation]], which mirrors the API's response shape
  * field-for-field, rather than the unrelated [[com.gu.support.promotions.Promotion]] domain model used by the legacy
  * productPrices/PromotionValidator mechanism (see guardian/support-frontend#8207).
  */
class PromotionsApiService(client: FutureHttpClient, config: PromotionsApiConfig)(implicit
    ec: ExecutionContext,
) extends WebServiceHelper[PromotionsApiServiceError] {
  override val httpClient: FutureHttpClient = client
  override val wsUrl: String = config.url
  override val verboseLogging: Boolean = false

  // The API caps promoCodes at 100 per request - this should never happen given our current usage.
  private val maxPromoCodesPerRequest = 100

  /** Fetches promotions by their promo codes, optionally filtering by active status.
    *
    * @param promoCodes
    *   The promo codes to fetch promotions for.
    * @param active
    *   Optional filter for active status. `None` fetches all promotions regardless of status.
    * @return
    *   A `Future` containing a list of promotions matching the given promo codes and active status.
    */
  def listByPromoCodes(
      promoCodes: Seq[String],
      active: Option[Boolean] = None,
  ): Future[List[PromoWithCatalogInformation]] = {
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
        params = Map("promoCodes" -> distinctCodes.mkString(",")) ++ active.map(a => "active" -> a.toString),
      ).map(_.promotions)
  }
}
