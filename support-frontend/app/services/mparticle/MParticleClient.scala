package services.mparticle

import com.gu.monitoring.SafeLogging
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import config.{MparticleConfig, MparticleConfigProvider}
import io.circe.generic.semiauto.deriveDecoder
import io.circe.{Decoder, Json}
import org.joda.time.DateTime
import services.mparticle.generic.RecordCache.RecordWithExpiry
import services.mparticle.generic.{RefreshOn401TokenProvider, RecordCache}

import scala.collection.immutable.Map.empty
import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.reflect.ClassTag

case class MParticleError(message: String) extends Throwable(message)

object MParticleError {
  implicit val mparticleErrorDecoder: Decoder[MParticleError] = deriveDecoder
}

object MParticleClient {

  def apply(
      httpClient: FutureHttpClient,
      mparticleConfigProvider: MparticleConfigProvider,
  )(implicit ec: ExecutionContext): MParticleClient = {

    lazy val config: MparticleConfig = mparticleConfigProvider.get()

    lazy val tokenProvider = {
      val authClient = new MParticleAuthClient(httpClient, config)
      val tokenCache = RecordCache.withExpiry(authClient)
      new RefreshOn401TokenProvider(tokenCache)
    }

    new MParticleClient(httpClient, config, tokenProvider)

  }

}

class MParticleClient(
    val httpClient: FutureHttpClient,
    val mparticleConfig: MparticleConfig,
    tokenProvider: RefreshOn401TokenProvider[MParticleAccessToken],
)(implicit ec: ExecutionContext)
    extends WebServiceHelper[MParticleError]
    with SafeLogging {

  override val wsUrl: String = mparticleConfig.apiUrl
  override val verboseLogging: Boolean = false

  def postJsonWithAuth[A: Decoder: ClassTag](
      endpoint: String,
      data: Json,
      headers: Map[String, String] = empty,
      params: Map[String, String] = empty,
  ): Future[A] = tokenProvider.withToken { token =>
    postJson[A](
      endpoint = endpoint,
      data = data,
      headers = headers ++ Map("Authorization" -> s"Bearer ${token.tokenAsString}"),
      params = params,
    )
  }

}
