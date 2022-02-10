package services

import akka.actor.ActorSystem
import cats.data.EitherT
import com.amazonaws.services.s3.AmazonS3
import com.github.blemale.scaffeine.{AsyncLoadingCache, Scaffeine}
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.typesafe.scalalogging.StrictLogging
import io.circe.parser._
import io.circe.{Decoder, Encoder}
import model.Environment
import model.Environment.{Live, Test}

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.io.{BufferedSource, Source}
import scala.util.Try

sealed trait SwitchState {
  def isOn: Boolean
}

object SwitchState {
  def fromString(s: String): SwitchState = if (s.toLowerCase == "on") On else Off

  case object On extends SwitchState { val isOn = true }

  case object Off extends SwitchState { val isOn = false }

  implicit val switchStateEncoder: Encoder[SwitchState] = Encoder.encodeString.contramap[SwitchState](_.toString)
  implicit val switchStateDecoder: Decoder[SwitchState] = Decoder.decodeString.map(SwitchState.fromString)

}

case class Switches(enableRecaptchaFrontend: Option[SwitchState], enableRecaptchaBackend: Option[SwitchState])

object Switches {
  implicit val switchesCodec: Codec[Switches] = deriveCodec
}

class SwitchService(env: Environment)(implicit s3: AmazonS3, system: ActorSystem, ec: ExecutionContext)
    extends StrictLogging {

  import cats.implicits._

  private val cacheKey = "switches"

  private val cache: AsyncLoadingCache[String, Switches] =
    Scaffeine()
      .recordStats()
      .expireAfterWrite(1.minutes)
      .maximumSize(10)
      .buildAsync(s => fromS3().getOrElse(Switches(None, None)))

  def recaptchaSwitches: EitherT[Future, Nothing, Switches] =
    EitherT.right(cache.get(cacheKey))

  private def fromBufferedSource(buf: BufferedSource): Either[Throwable, Switches] = {
    val switches = decode[Switches](buf.mkString)
    Try(buf.close())
    switches
  }

  def fromS3(): Either[Throwable, Switches] = {
    val stage = env match {
      case Live => "PROD"
      case Test => "CODE"
    }

    val path = s"$stage/switches.json"

    for {
      buf <- Either.catchNonFatal {
        val inputStream = s3.getObject("support-admin-console", path).getObjectContent
        Source.fromInputStream(inputStream)
      }
      switches <- fromBufferedSource(buf)
    } yield switches
  }

  def startPoller() = {
    import scala.concurrent.duration._

    system.scheduler.schedule(0.seconds, 1.minute) {
      fromS3().fold(
        err => logger.error(s"Error udpating cache for recaptchaSwitch:", err),
        update => {
          cache.put(cacheKey, Future(update))
        },
      )
    }
  }
}
