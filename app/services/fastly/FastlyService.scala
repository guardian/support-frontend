package services.fastly

import cats.data.EitherT
import cats.instances.future._
import cats.syntax.applicativeError._
import config.FastlyConfig
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

class FastlyService(config: FastlyConfig)(implicit client: WSClient) {

  // https://docs.fastly.com/api/purge#purge_d8b8e8be84c350dd92492453a3df3230
  def purgeSurrogateKey(key: String)(implicit ec: ExecutionContext): EitherT[Future, Throwable, Unit] = {
    client.url(s"https://api.fastly.com/service/${config.serviceId}/purge/$key")
      .withHttpHeaders(
        "Fastly-Key" -> config.apiToken,
        "Accept" -> "application/json"
      )
      .execute("POST")
      .attemptT
      .map(_ => ()) // TODO: return type
  }
}
