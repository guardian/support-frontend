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

// Polls `promotions-api` for all active promotions and caches them in memory
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

  // Get promotions for `promoCodes` from the cache
  def getActive(promoCodes: Seq[String]): Seq[PromoWithCatalogInformation] =
    promoCodes.flatMap(activePromotions.get().get)

  // Get the promotion for `promoCode`, fetching from the promotions API if it's not active / in the cache.
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
