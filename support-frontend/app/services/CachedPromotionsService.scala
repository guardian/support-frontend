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

/** Polls `promotions-api` (as resolved by [[CachedPromotionsServiceProvider]]) and caches the result in memory, so
  * pages can inject pre-resolved promotions into `window.guardian` without a client-side API call (see
  * guardian/support-frontend#8207/#8208).
  *
  * Callers just call [[get]] - it transparently fetches and caches any code that isn't already cached.
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

  // private[services], not private, so tests can exercise the cache-merge/expiry behaviour directly
  private[services] def fetchAndCache(promoCodes: Seq[String]): Future[Unit] =
    promotionsApiService
      .listByPromoCodes(promoCodes)
      .map(mergeIntoCache(promoCodes, _))
      .recoverWith { case NonFatal(e) =>
        AwsCloudWatchMetricPut(cloudwatchClient)(promotionsApiFailure(config.environment))
        logger.error(s"Failed to fetch promotions for codes [${promoCodes.mkString(", ")}]", e)
        Future.failed(e)
      }

  private def toPromotionsCache(promotions: Seq[Promotion]): PromotionsCache = {
    promotions.map(p => p.promoCode -> p).toMap
  }

  // Requested codes not found/active in this fetch are dropped from the cache; other cached codes are untouched.
  private def mergeIntoCache(requestedCodes: Seq[String], fetchedPromotions: Seq[Promotion]): Unit = {
    val fetched = toPromotionsCache(fetchedPromotions)
    cache.updateAndGet(current => (current -- requestedCodes) ++ fetched)
  }

  def get(promoCodes: Seq[String]): Future[Seq[Promotion]] = {
    val current = cache.get()
    val missingCodes = promoCodes.filterNot(current.contains)
    if (missingCodes.isEmpty) Future.successful(promoCodes.flatMap(current.get))
    else fetchAndCache(missingCodes).map(_ => promoCodes.flatMap(cache.get().get))
  }

  def get(promoCode: String): Future[Option[Promotion]] = get(Seq(promoCode)).map(_.headOption)

  private def updateDefaults(): Future[Unit] = fetchAndCache(defaultPromotionService.allPromoCodes)

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
