package services

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.i18n.Country
import com.gu.rest.WebServiceHelper
import com.gu.support.catalog.{DigitalPack, Product}
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{client => cloudwatchClient}
import com.gu.aws.AwsCloudWatchMetricSetup.salesTaxApiFailure
import com.gu.support.config.Stage
import io.circe.{Decoder, Json, JsonObject}
import io.circe.generic.semiauto.deriveDecoder
import org.apache.pekko.actor.ActorSystem
import play.api.Logging

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.duration.DurationInt
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.util.control.NonFatal

case class SalesTaxServiceError(message: String) extends Throwable
object SalesTaxServiceError {
  implicit val decoder: Decoder[SalesTaxServiceError] = deriveDecoder
}

class SalesTaxService(client: FutureHttpClient, val wsUrl: String, apiKey: String)
    extends WebServiceHelper[SalesTaxServiceError] {
  override val httpClient: FutureHttpClient = client
  override val verboseLogging: Boolean = false

  def get(productKey: Product, country: Country): Future[JsonObject] = {
    val body = Json.obj(
      // `Product.toString` yields the catalog ProductKey (e.g. "SupporterPlus") and `Country.alpha2` the
      // ISO 3166 alpha-2 code (e.g. "CA"), which are the values the tax rate API expects.
      "productKey" -> Json.fromString(SalesTaxService.productKeyForApi(productKey)),
      "country" -> Json.fromString(country.alpha2),
    )
    postJson[JsonObject](endpoint = "tax-rates", data = body, headers = Map("x-api-key" -> apiKey))
  }
}

// In other systems DigitalPack is referred to as "DigitalSubscription"
object SalesTaxService {
  def productKeyForApi(product: Product): String = product match {
    case DigitalPack => "DigitalSubscription"
    case other => other.toString
  }
}

/** Caches tax rates per (product, country) combination.
  *
  * @param combinations
  *   the (product, country) combinations to fetch on startup and keep refreshed.
  */
class CachedSalesTaxService(
    system: ActorSystem,
    salesTaxService: SalesTaxService,
    combinations: Seq[(Product, Country)],
    stage: Stage,
)(implicit
    ec: ExecutionContext,
) extends Logging {
  private val cache = new AtomicReference[Map[(Product, Country), JsonObject]](Map.empty)

  /** Fetches the tax rates for a single (product, country) combination and updates the cache. */
  private def update(product: Product, country: Country): Future[Unit] = {
    salesTaxService
      .get(product, country)
      .map { rates =>
        cache.updateAndGet(_.updated((product, country), rates))
      }
      .recoverWith { case NonFatal(e) =>
        // Send a CloudWatch metric whenever a call to the sales-tax-api fails, so we can alarm on it. This covers
        // both the fatal startup fetch and the scheduled background refreshes, since both go through `update`.
        AwsCloudWatchMetricPut(cloudwatchClient)(salesTaxApiFailure(stage))
        logger.error(s"Failed to fetch sales tax rates for $product in $country", e)
        Future.failed(e)
      }
  }

  private def updateAll(): Future[Unit] =
    Future.traverse(combinations) { case (product, country) => update(product, country) }.map(_ => ())

  /** Returns the cached tax rates for every product in `combinations` for the given country, combined into a single
    * JSON object keyed by product key, e.g.
    * {{{
    *   {
    *     "SupporterPlus": { "BC": 0.07, ... },
    *     "DigitalPack": { "BC": 0.07, ... }
    *   }
    * }}}
    */
  def get(country: Country): JsonObject = {
    val currentCache = cache.get()
    combinations
      .collect { case (product, `country`) => product }
      .distinct
      .foldLeft(JsonObject.empty) { (acc, product) =>
        currentCache.get((product, country)) match {
          case Some(rates) => acc.add(SalesTaxService.productKeyForApi(product), Json.fromJsonObject(rates))
          case None => acc
        }
      }
  }

  // Populate the cache when the service is created. This is an attempt to avoid a race condition where because the
  // service is instantiated lazily and the scheduled refresh runs asynchronously, the first read can happen before the
  // initial fetch completes.
  // If this initial fetch fails we deliberately let the exception propagate. This makes app startup fail, so the
  // instance fails its healthcheck and is never rotated into service rather than serving requests with missing tax
  // rate data.
  try {
    logger.info("Fetching tax rates on startup")
    Await.result(updateAll(), 30.seconds)
    logger.info("Successfully fetched tax rates on startup")
  } catch {
    case NonFatal(e) =>
      logger.error("Failed to fetch tax rates on startup, aborting app boot", e)
      throw SalesTaxServiceError(s"Failed to fetch tax rates on startup: ${e.getMessage}")
  }

  // Subsequent refreshes happen in the background. The initial delay is 1 minute because the cache has
  // already been populated synchronously above.
  system.scheduler.scheduleWithFixedDelay(1.minute, 10.minute) { () =>
    {
      updateAll()
    }
  }
}
