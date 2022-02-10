package services.fastly

import cats.data.EitherT
import cats.instances.future._
import cats.syntax.applicativeError._
import cats.syntax.either._
import config.FastlyConfig
import io.circe.{Decoder, DecodingFailure}
import io.circe.generic.semiauto.deriveDecoder
import play.api.libs.ws.WSClient

import FastlyService._

import scala.concurrent.{ExecutionContext, Future}

class FastlyService(config: FastlyConfig)(implicit client: WSClient) {

  // A left-hand type of throwable is fine,
  // since we are only handling the error by logging it (c.f. S3SettingsProvider)
  // https://docs.fastly.com/api/purge#purge_d8b8e8be84c350dd92492453a3df3230
  def purgeSurrogateKey(key: String)(implicit ec: ExecutionContext): EitherT[Future, Throwable, PurgeResponse] =
    client
      .url(s"https://api.fastly.com/service/${config.serviceId}/purge/$key")
      .withHttpHeaders(
        "Fastly-Key" -> config.apiToken,
        "Accept" -> "application/json",
      )
      .execute("POST")
      .attemptT
      .subflatMap[Throwable, PurgeResponse] { response =>
        PurgeResponse.decode(response.body)
      }
}

object FastlyService {

  // This is a not complete model of a purge response.
  // e.g. if the API token is invalid then the body will be {"msg":"Provided credentials are missing or invalid"}
  // However, for our purposes this is sufficient.
  case class PurgeResponse(status: String, id: String) {
    // True if the purge has been successful.
    // From inspection, a successful response has status 'ok'.
    def isOk: Boolean = status == "ok"
  }

  object PurgeResponse {

    implicit val purgeResponseDecoder: Decoder[PurgeResponse] = deriveDecoder[PurgeResponse]

    // Utility function adds json to decoding failure messages.
    def decode(json: String): Either[io.circe.Error, PurgeResponse] =
      io.circe.parser.decode[PurgeResponse](json).leftMap {
        case err: DecodingFailure => DecodingFailure(s"${err.message} - $json", err.history)
        case err => err
      }
  }
}
