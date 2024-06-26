package services

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.support.config.Stage
import com.gu.support.config.Stages.{CODE, DEV}
import io.circe.{Decoder, Json, JsonObject}
import io.circe.generic.semiauto.deriveDecoder
import org.apache.pekko.actor.ActorSystem

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.duration.DurationInt
import scala.concurrent.{ExecutionContext, Future}

case class ProductCatalogServiceError(message: String) extends Throwable
object ProductCatalogServiceError {
  implicit val decoder: Decoder[ProductCatalogServiceError] = deriveDecoder
}

trait ProductCatalogService extends WebServiceHelper[ProductCatalogServiceError] {
  val client: FutureHttpClient
  override val wsUrl: String
  override val httpClient: FutureHttpClient = client

  def get(): Future[JsonObject] = {
    get[JsonObject](endpoint = "product-catalog.json")
  }
}

class ProdProductCatalogService(val client: FutureHttpClient) extends ProductCatalogService {
  val wsUrl: String = "https://product-catalog.guardianapis.com"
}

class CodeProductCatalogService(val client: FutureHttpClient) extends ProductCatalogService {
  val wsUrl: String = "https://product-catalog.code.dev-guardianapis.com"
}

class CachedProductCatalogService(system: ActorSystem, productCatalogService: ProductCatalogService)(implicit
    ec: ExecutionContext,
) {
  private val json = new AtomicReference[JsonObject](JsonObject())
  private def update() = {
    productCatalogService.get().map(json.set)
  }
  def get(): JsonObject = json.get()

  system.scheduler.scheduleWithFixedDelay(0.minutes, 1.minutes) { () =>
    {
      update()
    }
  }
}

class CachedProductCatalogServiceProvider(
    codeCachedProductCatalogService: CachedProductCatalogService,
    prodCachedProductCatalogService: CachedProductCatalogService,
) {
  def fromStage(stage: Stage, isTestUser: Boolean) =
    if (stage == DEV || stage == CODE || isTestUser)
      codeCachedProductCatalogService
    else prodCachedProductCatalogService
}
