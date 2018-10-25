package admin

import scala.io.{BufferedSource, Source}
import com.typesafe.config.Config

import play.api.mvc.RequestHeader
import codecs.CirceDecoders._
import io.circe.parser._
import cats.implicits._
import com.amazonaws.services.s3.AmazonS3

import scala.util.Try

case class Switches(
    oneOffPaymentMethods: PaymentMethodsSwitch,
    recurringPaymentMethods: PaymentMethodsSwitch,
    experiments: Map[String, ExperimentSwitch],
    optimize: SwitchState,
    internationalSubscribePages: SwitchState
)

case class Settings(switches: Switches)

object Settings {

  private def fromBufferedSource(buf: BufferedSource): Either[Throwable, Settings] = {
    val settings = decode[Settings](buf.mkString)
    Try(buf.close())
    settings
  }

  def fromS3(source: SettingsSource.S3)(implicit s3: AmazonS3): Either[Throwable, Settings] =
    for {
      buf <- Either.catchNonFatal {
        val inputStream = s3.getObject(source.bucket, source.key).getObjectContent
        Source.fromInputStream(inputStream)
      }
      settings <- fromBufferedSource(buf)
    } yield settings

  def fromLocalFile(source: SettingsSource.LocalFile): Either[Throwable, Settings] =
    for {
      buf <- Either.catchNonFatal {
        val homeDir = System.getProperty("user.home")
        val localPath = source.path.replaceFirst("~", homeDir)
        Source.fromFile(localPath)
      }
      settings <- fromBufferedSource(buf)
    } yield settings
}

sealed trait SettingsSource

object SettingsSource {

  case class S3(bucket: String, key: String) extends SettingsSource {
    override def toString: String = s"s3://$bucket/$key"
  }

  case class LocalFile(path: String) extends SettingsSource {
    override def toString: String = s"local file at $path"
  }

  def fromConfig(config: Config): Either[Throwable, SettingsSource] =
    fromLocalFile(config).orElse(fromS3(config))
      .leftMap(err => new Error(s"settingsSource was not correctly set in config. $err"))

  private def fromLocalFile(config: Config): Either[Throwable, SettingsSource] = Either.catchNonFatal {
    LocalFile(config.getString("settingsSource.local.path"))
  }

  private def fromS3(config: Config): Either[Throwable, SettingsSource] = Either.catchNonFatal {
    S3(
      config.getString("settingsSource.s3.bucket"),
      config.getString("settingsSource.s3.key")
    )
  }

}

case class PaymentMethodsSwitch(stripe: SwitchState, payPal: SwitchState, directDebit: Option[SwitchState])
case class ExperimentSwitch(name: String, description: String, state: SwitchState) {
  def isOn: Boolean = state == SwitchState.On

  def isInVariant(participation: ServersideAbTest.Participation): Boolean =
    participation == ServersideAbTest.Variant && isOn

  def isInControl(participation: ServersideAbTest.Participation): Boolean =
    participation == ServersideAbTest.Control && isOn
}

object PaymentMethodsSwitch {
  def fromConfig(config: Config): PaymentMethodsSwitch =
    PaymentMethodsSwitch(
      SwitchState.fromConfig(config, "stripe"),
      SwitchState.fromConfig(config, "payPal"),
      if (config.hasPath("directDebit"))
        Some(SwitchState.fromConfig(config, "directDebit"))
      else
        None
    )
}

object ExperimentSwitch {
  def fromConfig(config: Config): ExperimentSwitch =
    ExperimentSwitch(
      config.getString("name"),
      config.getString("description"),
      SwitchState.fromConfig(config, "state")
    )
}

sealed trait SwitchState {
  def isOn: Boolean
}

object SwitchState {
  def fromConfig(config: Config, path: String): SwitchState = fromString(config.getString(path))

  def fromString(s: String): SwitchState = if (s.toLowerCase == "on") On else Off

  case object On extends SwitchState { val isOn = true }

  case object Off extends SwitchState { val isOn = false }

}

