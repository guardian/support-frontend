package admin.settings

import java.io.FileNotFoundException
import java.nio.file.{Files, Paths}

import admin.ServersideAbTest
import cats.implicits._
import com.amazonaws.services.s3.AmazonS3
import com.gu.support.config.Stage
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import config.Configuration.MetricUrl
import io.circe.parser._
import io.circe.{Decoder, Encoder}

import scala.io.{BufferedSource, Source}
import scala.util.Try

case class AllSettings(
  switches: Switches,
  amounts: AmountsRegions,
  contributionTypes: ContributionTypes,
  metricUrl: MetricUrl
)

object AllSettings {
  import Amounts._  // intellij doesn't think this is needed, but it is
  import ContributionTypes._

  implicit val metricUrlEncoder: Encoder[MetricUrl] = Encoder.encodeString.contramap(_.value)
  implicit val metricUrlDecoder: Decoder[MetricUrl] = Decoder.decodeString.map(MetricUrl)
  implicit val allSettingsCodec: Codec[AllSettings] = deriveCodec[AllSettings]
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

case class SettingsSources(switches: SettingsSource, amounts: SettingsSource, contributionTypes: SettingsSource)

object SettingsSources {
  def fromConfig(config: Config, stage: Stage): Either[Throwable, SettingsSources] = {
    for {
      switchesSource <- SettingsSource.fromConfig(config, "switches", stage)
      amountsSource <- SettingsSource.fromConfig(config, "amounts", stage)
      contributionTypesSource <- SettingsSource.fromConfig(config, "contributionTypes", stage)
    } yield SettingsSources(switchesSource, amountsSource, contributionTypesSource)
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

  def fromConfig(config: Config, name: String, stage: Stage): Either[Throwable, SettingsSource] =
    fromLocalFile(config, name).orElse(fromS3(config, name, stage))
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

  private def fromS3(config: Config, name: String, stage: Stage): Either[Throwable, SettingsSource] = Either.catchNonFatal {
    S3(
      bucket = config.getString(s"settingsSource.s3.bucket"),
      key = s"$stage/$name.json"
    )
  }

}

case class PaymentMethodsSwitch(
  stripe: SwitchState,
  stripeApplePay: SwitchState,
  stripePaymentRequestButton: SwitchState,
  payPal: SwitchState,
  directDebit: Option[SwitchState],
  existingCard: Option[SwitchState],
  existingDirectDebit: Option[SwitchState],
  amazonPay: Option[SwitchState]
)
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
      SwitchState.fromConfig(config, "stripeApplePay"),
      SwitchState.fromConfig(config, "stripePaymentRequestButton"),
      SwitchState.fromConfig(config, "payPal"),
      SwitchState.optionFromConfig(config, "directDebit"),
      SwitchState.optionFromConfig(config, "existingCard"),
      SwitchState.optionFromConfig(config, "existingDirectDebit"),
      SwitchState.optionFromConfig(config, "amazonPay")
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
  def optionFromConfig(config: Config, path: String): Option[SwitchState] =
    if(config.hasPath(path))
      Some(fromConfig(config, path))
    else
      None

  def fromConfig(config: Config, path: String): SwitchState = fromString(config.getString(path))

  def fromString(s: String): SwitchState = if (s.toLowerCase == "on") On else Off

  case object On extends SwitchState { val isOn = true }

  case object Off extends SwitchState { val isOn = false }

  implicit val switchStateEncoder: Encoder[SwitchState] = Encoder.encodeString.contramap[SwitchState](_.toString)
  implicit val switchStateDecoder: Decoder[SwitchState] = Decoder.decodeString.map(SwitchState.fromString)

}

