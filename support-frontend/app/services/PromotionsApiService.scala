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
  * for the legacy Zuora-catalog-embedded promotions used by [[com.gu.support.promotions.PromotionService]]. Only the
  * `promoCodes` filter is used, not "all active" promotions - see
  * https://github.com/guardian/support-frontend/issues/8208 for why.
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

  // The API caps promoCodes at 100 per request; we chunk defensively client-side too.
  private val maxPromoCodesPerRequest = 100

  def listByPromoCodes(promoCodes: Seq[String], active: Boolean = true): Future[List[Promotion]] = {
    val distinctCodes = promoCodes.distinct
    if (distinctCodes.isEmpty) Future.successful(Nil)
    else
      Future
        .traverse(distinctCodes.grouped(maxPromoCodesPerRequest).toList)(fetchChunk(_, active, config.apiKey))
        .map(_.flatten)
  }

  private def fetchChunk(promoCodes: Seq[String], active: Boolean, apiKey: String): Future[List[Promotion]] =
    get[ListPromotionsResponse](
      endpoint = "promotions",
      headers = Map("x-api-key" -> apiKey),
      params = Map(
        "promoCodes" -> promoCodes.mkString(","),
        "active" -> active.toString,
      ),
    ).map(_.promotions)
}
