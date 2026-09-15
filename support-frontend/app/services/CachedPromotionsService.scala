package services

import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{client => cloudwatchClient}
import com.gu.aws.AwsCloudWatchMetricSetup.promotionsApiFailure
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.support.config.{PromotionsApiConfig, PromotionsApiConfigProvider}
import com.gu.support.promotions.Promotion
import com.gu.support.touchpoint.{TouchpointService, TouchpointServiceProvider}
import org.apache.pekko.actor.ActorSystem
import play.api.Logging
import services.pricing.DefaultPromotionService

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.duration.DurationInt
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.util.control.NonFatal

/** Polls a single `promotions-api` backend environment (as resolved by [[CachedPromotionsServiceProvider]]) and caches
  * the result in memory, so pages can inject pre-resolved promotions into `window.guardian` without any client-side API
  * call (see guardian/support-frontend#8207/#8208).
  *
  * Only ever fetches known, explicit "candidate" promo codes - the curated per-product defaults from
  * `defaultPromotionService` - rather than "all active" promotions (see #8208). Additional ad-hoc codes (e.g. a
  * `?promoCode=` query param, or checkout-nudge test codes) can be resolved on demand via [[fetchAdditionalCodes]]
  * without waiting for the next scheduled poll of the defaults.
  */
class CachedPromotionsService(
    system: ActorSystem,
    promotionsApiService: PromotionsApiService,
    defaultPromotionService: DefaultPromotionService,
    config: PromotionsApiConfig,
)(implicit ec: ExecutionContext)
    extends TouchpointService
    with Logging {

  private type PromotionsCache = Map[String, Promotion]
  private val cache = new AtomicReference[PromotionsCache](Map.empty)

  private def updateDefaults(): Future[Unit] = fetchAndCache(defaultPromotionService.allPromoCodes)

  def fetchAndCache(promoCodes: Seq[String]): Future[Unit] =
    promotionsApiService
      .listByPromoCodes(promoCodes)
      .map(mergeIntoCache(promoCodes, _))
      .recoverWith { case NonFatal(e) =>
        AwsCloudWatchMetricPut(cloudwatchClient)(promotionsApiFailure(config.environment))
        logger.error(s"Failed to fetch promotions for codes [${promoCodes.mkString(", ")}]", e)
        Future.failed(e)
      }

  /** Merges freshly-fetched promotions into the cache: requested codes that weren't found/active in this fetch are
    * dropped, but any other, previously-cached codes (e.g. from a different candidate set) are left untouched.
    */
  private def mergeIntoCache(requestedCodes: Seq[String], fetchedPromotions: Seq[Promotion]): Unit = {
    val fetched = toPromoMap(fetchedPromotions)
    cache.updateAndGet(current => (current -- requestedCodes) ++ fetched)
    ()
  }

  private def toPromoMap(promotions: Seq[Promotion]) = {
    promotions.map(p => p.promoCode -> p).toMap
  }

  def get(promoCode: String): Option[Promotion] = cache.get().get(promoCode)

  /** Resolves promo codes that aren't part of the pre-cached default set, caching the result for subsequent requests.
    * Safe to call with codes that are already cached - it's just a cheap re-fetch.
    */
  def fetchAdditionalCodes(promoCodes: Seq[String]): Future[Map[String, Promotion]] =
    fetchAndCache(promoCodes).map(_ => toPromoMap(promoCodes.flatMap(code => get(code))))

  // Populate the cache synchronously on startup (mirroring CachedSalesTaxService) so the first request(s) aren't
  // served from an empty cache. Unlike CachedSalesTaxService, we don't fail app startup if this fails - promotions
  // are an enhancement, not something a correct price depends on.
  try {
    logger.info(s"Fetching default promotions on startup for ${config.environment}")
    Await.result(updateDefaults(), 30.seconds)
    logger.info(s"Successfully fetched default promotions on startup for ${config.environment}")
  } catch {
    case NonFatal(e) =>
      logger.error(
        s"Failed to fetch default promotions on startup for ${config.environment}, continuing with an empty cache",
        e,
      )
  }

  system.scheduler.scheduleWithFixedDelay(1.minute, 1.minute) { () =>
    {
      updateDefaults()
    }
  }
}

/** Selects the CODE or PROD instance of [[CachedPromotionsService]], following the same `TouchpointServiceProvider`
  * pattern used for Zuora/Stripe/PayPal/GoCardless.
  */
class CachedPromotionsServiceProvider(
    configProvider: PromotionsApiConfigProvider,
    system: ActorSystem,
    defaultPromotionService: DefaultPromotionService,
    client: FutureHttpClient,
)(implicit ec: ExecutionContext)
    extends TouchpointServiceProvider[CachedPromotionsService, PromotionsApiConfig](configProvider) {
  override protected def createService(config: PromotionsApiConfig): CachedPromotionsService =
    new CachedPromotionsService(system, new PromotionsApiService(client, config), defaultPromotionService, config)
}
