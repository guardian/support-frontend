package services.mparticle

import com.gu.monitoring.SafeLogging
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import config.{MparticleConfig, MparticleConfigProvider}
import io.circe.generic.semiauto.deriveDecoder
import io.circe.{Decoder, Json}

import scala.collection.immutable.Map.empty
import scala.concurrent.{ExecutionContext, Future}
import scala.reflect.ClassTag

case class MParticleError(message: String) extends Throwable(message)

object MParticleError {
  implicit val mparticleErrorDecoder: Decoder[MParticleError] = deriveDecoder
}

class MParticleClient(
    val httpClient: FutureHttpClient,
    mparticleConfigProvider: MparticleConfigProvider,
)(implicit ec: ExecutionContext)
    extends WebServiceHelper[MParticleError]
    with SafeLogging {

  lazy val mparticleConfig: MparticleConfig = mparticleConfigProvider.get()

  private lazy val tokenProvider = MParticleTokenProvider(httpClient, mparticleConfig)

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
