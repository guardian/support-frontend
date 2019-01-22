package admin.settings

import java.io.FileNotFoundException
import java.nio.file.{Files, Paths}

import admin.ServersideAbTest
import cats.implicits._
import com.amazonaws.services.s3.AmazonS3
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import io.circe.{Decoder, Encoder}

import scala.io.{BufferedSource, Source}
import scala.util.Try

case class AllSettings(switches: Switches, amounts: Amounts)

object AllSettings {
  implicit val allSettingsCodec: Codec[AllSettings] = deriveCodec
}

object Settings {
  private def fromBufferedSource[T: Decoder](buf: BufferedSource): Either[Throwable, T] = {
    val settings = decode[T](buf.mkString)
    Try(buf.close())
    settings
  }

  def fromS3[T: Decoder](source: SettingsSource.S3)(implicit s3: AmazonS3): Either[Throwable, T] =
    for {
      buf <- Either.catchNonFatal {
        val inputStream = s3.getObject(source.bucket, source.key).getObjectContent
        Source.fromInputStream(inputStream)
      }
      settings <- fromBufferedSource(buf)
    } yield settings

  def fromLocalFile[T: Decoder](source: SettingsSource.LocalFile): Either[Throwable, T] =
    for {
      buf <- Either.catchNonFatal {
        Source.fromFile(source.path)
      }
      settings <- fromBufferedSource(buf)
    } yield settings
}

case class SettingsSources(switches: SettingsSource, amounts: SettingsSource)

object SettingsSources {
  def fromConfig(config: Config): Either[Throwable, SettingsSources] = {
    for {
      switchesSource <- SettingsSource.fromConfig(config, "switches")
      amountsSource <- SettingsSource.fromConfig(config, "amounts")
    } yield SettingsSources(switchesSource, amountsSource)
  }
}

sealed trait SettingsSource

object SettingsSource extends LazyLogging {

  case class S3(bucket: String, key: String) extends SettingsSource {
    override def toString: String = s"s3://$bucket/$key"
  }

  case class LocalFile(path: String) extends SettingsSource {
    override def toString: String = s"local file at $path"
  }

  def fromConfig(config: Config, name: String): Either[Throwable, SettingsSource] =
    fromLocalFile(config, name).orElse(fromS3(config, name))
      .leftMap(err => new Error(s"settingsSource was not correctly set in config. $err"))

  private def fromLocalFile(config: Config, name: String): Either[Throwable, SettingsSource] = Either.catchNonFatal {
    val localFile = expandHomeDirectory(config.getString(s"settingsSource.$name.local.path"))
    if (Files.exists(Paths.get(localFile))) {
      logger.info(s"Loading settings from $localFile")
      LocalFile(localFile)
    } else {
      logger.info(s"Local settings file doesn't exist: $localFile")
      throw new FileNotFoundException(localFile)
    }
  }

  private def expandHomeDirectory(path: String) = {
    val homeDir = System.getProperty("user.home")
    path.replaceFirst("~", homeDir)
  }

  private def fromS3(config: Config, name: String): Either[Throwable, SettingsSource] = Either.catchNonFatal {
    S3(
      config.getString(s"settingsSource.$name.s3.bucket"),
      config.getString(s"settingsSource.$name.s3.key")
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
  implicit val paymentMethodsSwitchCodec: Codec[PaymentMethodsSwitch] = deriveCodec
}

object ExperimentSwitch {
  def fromConfig(config: Config): ExperimentSwitch =
    ExperimentSwitch(
      config.getString("name"),
      config.getString("description"),
      SwitchState.fromConfig(config, "state")
    )
  implicit val experimentSwitchCodec: Codec[ExperimentSwitch] = deriveCodec
}

sealed trait SwitchState {
  def isOn: Boolean
}

object SwitchState {
  def fromConfig(config: Config, path: String): SwitchState = fromString(config.getString(path))

  def fromString(s: String): SwitchState = if (s.toLowerCase == "on") On else Off

  case object On extends SwitchState { val isOn = true }

  case object Off extends SwitchState { val isOn = false }

  implicit val switchStateEncoder: Encoder[SwitchState] = Encoder.encodeString.contramap[SwitchState](_.toString)
  implicit val switchStateDecoder: Decoder[SwitchState] = Decoder.decodeString.map(SwitchState.fromString)

}

