package services

import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{client => cloudwatchClient}
import com.gu.aws.AwsCloudWatchMetricSetup.promotionsApiFailure
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.support.catalog.{DigitalPack, GuardianWeekly, Paper, Product, SupporterPlus, TierThree}
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

/** Polls a single `promotions-api` backend environment (CODE or PROD, as resolved by
  * [[CachedPromotionsServiceProvider]] / [[PromotionsApiConfigProvider]]) server-side (mirroring
  * [[CachedProductCatalogService]]/[[CachedSalesTaxService]]) and caches the result in memory, so pages can inject
  * pre-resolved promotions into `window.guardian` without any client-side API call (see
  * guardian/support-frontend#8207/#8208).
  *
  * Only ever fetches known, explicit "candidate" promo codes - the curated per-product defaults from
  * `defaultPromotionService` (`support-admin-console`'s `default-promos.json`) - rather than "all active" promotions,
  * matching the resolution model already in place today (see guardian/support-frontend#8208 for the full reasoning).
  * Additional candidate codes (e.g. an ad-hoc `?promoCode=` from a request, or checkout-nudge test codes from
  * `settings.checkoutNudgeTests`) can be resolved on demand via [[fetchAdditionalCodes]] without waiting for the next
  * scheduled poll of the defaults.
  */
class CachedPromotionsService(
    system: ActorSystem,
    promotionsApiService: PromotionsApiService,
    defaultPromotionService: DefaultPromotionService,
    config: PromotionsApiConfig,
)(implicit ec: ExecutionContext)
    extends TouchpointService
    with Logging {
  private val cache = new AtomicReference[Map[String, Promotion]](Map.empty)

  private val defaultPromoProducts: Seq[Product] = Seq(GuardianWeekly, Paper, DigitalPack, SupporterPlus, TierThree)

  private def currentDefaultPromoCodes: Seq[String] =
    defaultPromoProducts.flatMap(defaultPromotionService.getPromoCodes).distinct

  private def updateDefaults(): Future[Unit] = fetchAndCache(currentDefaultPromoCodes)

  /** Fetches the given promo codes from `promotions-api` and merges the result into the cache (codes that are no longer
    * found/active are dropped from the cache, same as they'd be omitted from the API response).
    */
  def fetchAndCache(promoCodes: Seq[String]): Future[Unit] =
    promotionsApiService
      .listByPromoCodes(promoCodes)
      .map { promotions =>
        val fetched = promotions.map(p => p.promoCode -> p).toMap
        cache.updateAndGet { current =>
          // Drop any of the *requested* codes that weren't found/active in this fetch, but leave any other
          // previously-cached codes (e.g. from a different candidate set) untouched.
          (current -- promoCodes) ++ fetched
        }
        ()
      }
      .recoverWith { case NonFatal(e) =>
        AwsCloudWatchMetricPut(cloudwatchClient)(promotionsApiFailure(config.environment))
        logger.error(s"Failed to fetch promotions for codes [${promoCodes.mkString(", ")}]", e)
        Future.failed(e)
      }

  /** Synchronous, in-memory lookup - use this for the common case where the candidate code is already known to be one
    * of the pre-cached defaults.
    */
  def get(promoCode: String): Option[Promotion] = cache.get().get(promoCode)

  /** Resolves one or more additional promo codes that aren't part of the pre-cached default set (e.g. an ad-hoc
    * `?promoCode=` query string value, or a checkout-nudge test code) with a live lookup, caching the result for
    * subsequent requests. Safe to call with codes that are already cached - it's just a cheap re-fetch.
    */
  def fetchAdditionalCodes(promoCodes: Seq[String]): Future[Map[String, Promotion]] =
    fetchAndCache(promoCodes).map(_ => promoCodes.flatMap(code => get(code).map(code -> _)).toMap)

  // Populate the cache with the default promo codes synchronously on startup (mirroring CachedSalesTaxService), so
  // the first request(s) aren't served from an empty cache while the first scheduled poll is still in flight.
  // Unlike CachedSalesTaxService, we deliberately don't fail app startup if this fails - promotions are an
  // enhancement (a page still renders, just without a promo applied, if a code fails to resolve), whereas tax rates
  // are needed to compute a correct price.
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

/** Selects the CODE or PROD instance of [[CachedPromotionsService]] based on stage/test-user status, following the same
  * `TouchpointServiceProvider` pattern used for every other 3rd-party-backend-per-environment service (Zuora, Stripe,
  * PayPal, GoCardless, ...): a CODE/DEV-deployed app always resolves to the CODE environment for both `forUser(false)`
  * and `forUser(true)`, so it never needs a real PROD `promotions-api` key; a PROD-deployed app resolves to PROD for
  * `forUser(false)` and CODE for `forUser(true)`, so it needs both.
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
