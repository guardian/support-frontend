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

/** A thin client for a single `promotions-api` (guardian/support-service-lambdas) backend environment - CODE or PROD,
  * as resolved by [[com.gu.support.config.PromotionsApiConfigProvider]] - the replacement for the legacy
  * Zuora-catalog-embedded promotions used by [[com.gu.support.promotions.PromotionService]]. Only the `promoCodes`
  * filter is used (rather than fetching "all active" promotions) - see
  * https://github.com/guardian/support-frontend/issues/8208 for why.
  *
  * Reuses the existing [[Promotion]] domain model/decoder (already shaped for the legacy Zuora-embedded promotions
  * JSON) since the new API's response fields (`promoCode`, `startTimestamp`/`endTimestamp`, `appliesTo`, `discount`,
  * `landingPage`, `isIntroductoryPricing`, ...) are a compatible subset - the API's extra `appliesTo.catalogRatePlans`
  * field is simply ignored by the existing decoder.
  *
  * `config.apiKey` is an `Option` because it's provisioned in Parameter Store as a separate infra step (see
  * guardian/support-frontend#8207) - if it's absent, `listByPromoCodes` short-circuits to an empty result rather than
  * making a request that would just 403.
  */
class PromotionsApiService(client: FutureHttpClient, config: PromotionsApiConfig)(implicit
    ec: ExecutionContext,
) extends WebServiceHelper[PromotionsApiServiceError] {
  override val httpClient: FutureHttpClient = client
  override val wsUrl: String = config.url
  override val verboseLogging: Boolean = false

  // The API caps promoCodes at 100 unique codes per request (matching DynamoDB's BatchGetItem limit) and de-dupes
  // internally, but we chunk defensively client-side too in case the combined candidate list ever grows past that.
  private val maxPromoCodesPerRequest = 100

  /** Fetches only the given, explicit promo codes - never "all active" promotions (see class docs for why). Codes that
    * don't exist, or aren't currently active, are simply omitted from the response - same as the API's own behaviour.
    */
  def listByPromoCodes(promoCodes: Seq[String], active: Boolean = true): Future[List[Promotion]] = {
    val distinctCodes = promoCodes.distinct
    config.apiKey match {
      case _ if distinctCodes.isEmpty => Future.successful(Nil)
      case None =>
        logger.warn(s"Skipping promotions-api lookup for [${distinctCodes.mkString(", ")}] - no API key configured")
        Future.successful(Nil)
      case Some(key) =>
        Future
          .traverse(distinctCodes.grouped(maxPromoCodesPerRequest).toList)(fetchChunk(_, active, key))
          .map(_.flatten)
    }
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
