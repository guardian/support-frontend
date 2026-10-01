package services

import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{client => cloudwatchClient}
import com.gu.aws.AwsCloudWatchMetricSetup.promotionsApiFailure
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.support.config.{PromotionsApiConfig, PromotionsApiConfigProvider}
import com.gu.support.promotions.PromoWithCatalogInformation
import com.gu.support.touchpoint.{TouchpointService, TouchpointServiceProvider}
import org.apache.pekko.actor.ActorSystem
import play.api.Logging

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.duration.DurationInt
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.util.control.NonFatal

/** Polls `promotions-api` (as resolved by [[CachedPromotionsServiceProvider]]) for all active promotions and caches
  * them in memory, so pages can inject pre-resolved promotions into `window.guardian` without a client-side API call
  * (see guardian/support-frontend#8207/#8208).
  *
  *   - [[getActive]] only reads from the cache, so it never calls promotions-api on a page request (e.g. for an
  *     arbitrary promoCode in the query string) and keeps returning the last successfully fetched promotions if
  *     promotions-api becomes unavailable.
  *   - [[get]] falls back to fetching a code which isn't cached, for pages which need inactive (e.g. expired)
  *     promotions. Those aren't cached.
  */
class CachedPromotionsService(
    system: ActorSystem,
    promotionsApiService: PromotionsApiService,
    config: PromotionsApiConfig,
)(implicit ec: ExecutionContext)
    extends TouchpointService
    with Logging {

  private val activePromotions = new AtomicReference[Map[String, PromoWithCatalogInformation]](Map.empty)

  private def recordFailure(message: String, e: Throwable): Unit = {
    AwsCloudWatchMetricPut(cloudwatchClient)(promotionsApiFailure(config.environment))
    logger.error(message, e)
  }

  // private[services], not private, so tests can trigger a refresh directly
  private[services] def refresh(): Future[Unit] =
    promotionsApiService
      .listActive()
      .map(promotions => activePromotions.set(promotions.map(p => p.promoCode -> p).toMap))
      .recoverWith { case NonFatal(e) =>
        recordFailure("Failed to fetch active promotions, continuing with the previously cached promotions", e)
        Future.failed(e)
      }

  /** The active promotions for `promoCodes`, in the same order. Codes which aren't active are omitted. */
  def getActive(promoCodes: Seq[String]): Seq[PromoWithCatalogInformation] =
    promoCodes.flatMap(activePromotions.get().get)

  /** The promotion for `promoCode`, whether or not it's active. */
  def get(promoCode: String): Future[Option[PromoWithCatalogInformation]] =
    activePromotions.get().get(promoCode) match {
      case Some(promotion) => Future.successful(Some(promotion))
      case None =>
        promotionsApiService
          .listByPromoCodes(Seq(promoCode))
          .map(_.headOption)
          .recoverWith { case NonFatal(e) =>
            recordFailure(s"Failed to fetch promotion $promoCode", e)
            Future.failed(e)
          }
    }

  try {
    logger.info(s"Fetching active promotions on startup for ${config.environment}")
    Await.result(refresh(), 30.seconds)
    logger.info(s"Successfully fetched active promotions on startup for ${config.environment}")
  } catch {
    case NonFatal(e) =>
      logger.error(
        s"Failed to fetch active promotions on startup for ${config.environment}, continuing with an empty cache",
        e,
      )
  }

  system.scheduler.scheduleWithFixedDelay(1.minute, 1.minute) { () =>
    {
      refresh()
    }
  }
}

class CachedPromotionsServiceProvider(
    configProvider: PromotionsApiConfigProvider,
    system: ActorSystem,
    client: FutureHttpClient,
)(implicit ec: ExecutionContext)
    extends TouchpointServiceProvider[CachedPromotionsService, PromotionsApiConfig](configProvider) {
  override protected def createService(config: PromotionsApiConfig): CachedPromotionsService =
    new CachedPromotionsService(system, new PromotionsApiService(client, config), config)
}
