package services

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.i18n.Country
import com.gu.rest.WebServiceHelper
import com.gu.support.catalog.{DigitalPack, Product}
import io.circe.{Decoder, Json, JsonObject}
import io.circe.generic.semiauto.deriveDecoder
import org.apache.pekko.actor.ActorSystem

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.duration.DurationInt
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.util.control.NonFatal

case class TaxRateServiceError(message: String) extends Throwable
object TaxRateServiceError {
  implicit val decoder: Decoder[TaxRateServiceError] = deriveDecoder
}

class TaxRateService(client: FutureHttpClient, val wsUrl: String, apiKey: String)
    extends WebServiceHelper[TaxRateServiceError] {
  override val httpClient: FutureHttpClient = client
  override val verboseLogging: Boolean = false

  def get(productKey: Product, country: Country): Future[JsonObject] = {
    val body = Json.obj(
      // `Product.toString` yields the catalog ProductKey (e.g. "SupporterPlus") and `Country.alpha2` the
      // ISO 3166 alpha-2 code (e.g. "CA"), which are the values the tax rate API expects.
      "productKey" -> Json.fromString(TaxRateService.productKeyForApi(productKey)),
      "country" -> Json.fromString(country.alpha2),
    )
    postJson[JsonObject](endpoint = "tax-rates", data = body, headers = Map("x-api-key" -> apiKey))
  }
}

// In other systems DigitalPack is referred to as "DigitalSubscription"
object TaxRateService {
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
class CachedTaxRateService(
    system: ActorSystem,
    taxRateService: TaxRateService,
    combinations: Seq[(Product, Country)],
)(implicit
    ec: ExecutionContext,
) {
  private val cache = new AtomicReference[Map[(Product, Country), JsonObject]](Map.empty)

  /** Fetches the tax rates for a single (product, country) combination and updates the cache. */
  private def update(product: Product, country: Country): Future[Unit] = {
    taxRateService.get(product, country).map { rates =>
      cache.updateAndGet(_.updated((product, country), rates))
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
          case Some(rates) => acc.add(TaxRateService.productKeyForApi(product), Json.fromJsonObject(rates))
          case None => acc
        }
      }
  }

  // Populate the cache synchronously on startup so that the very first request doesn't see an empty value.
  // Without this there's a race condition: the service is instantiated lazily and the scheduled refresh runs
  // asynchronously, so the first read can happen before the initial fetch completes.
  try {
    Await.result(updateAll(), 30.seconds)
  } catch {
    case NonFatal(_) =>
    // Swallow startup failures so the app can still boot; the scheduled refresh below will retry.
  }

  // Subsequent refreshes happen in the background. The initial delay is 1 minute because the cache has
  // already been populated synchronously above.
  system.scheduler.scheduleWithFixedDelay(1.minute, 10.minute) { () =>
    {
      updateAll()
    }
  }
}
