package services

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
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

  def get(): Future[JsonObject] = {
    // TODO: replace hardcoded productKey/country with dynamic values
    val body = Json.obj(
      "productKey" -> Json.fromString("SupporterPlus"),
      "country" -> Json.fromString("CA"),
    )
    postJson[JsonObject](endpoint = "tax-rates", data = body, headers = Map("x-api-key" -> apiKey))
  }
}

class CachedTaxRateService(system: ActorSystem, taxRateService: TaxRateService)(implicit
    ec: ExecutionContext,
) {
  private val json = new AtomicReference[JsonObject](JsonObject())
  private def update(): Future[Unit] = {
    taxRateService.get().map(json.set)
  }
  def get(): JsonObject = json.get()

  // Populate the cache synchronously on startup so that the very first request doesn't see an empty value.
  // Without this there's a race condition: the service is instantiated lazily and the scheduled refresh runs
  // asynchronously, so the first read can happen before the initial fetch completes.
  try {
    Await.result(update(), 30.seconds)
  } catch {
    case NonFatal(_) =>
    // Swallow startup failures so the app can still boot; the scheduled refresh below will retry.
  }

  // Subsequent refreshes happen in the background. The initial delay is 1 minute because the cache has
  // already been populated synchronously above.
  system.scheduler.scheduleWithFixedDelay(1.minute, 1.minute) { () =>
    {
      update()
    }
  }
}
