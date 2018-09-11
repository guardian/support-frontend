package admin

import scala.io.Source
import com.typesafe.config.Config

import collection.JavaConverters._
import play.api.mvc.RequestHeader
import codecs.CirceDecoders._
import io.circe.parser._
import cats.implicits._
import com.amazonaws.services.s3.AmazonS3
import io.circe.syntax._

case class Switches(
    oneOffPaymentMethods: PaymentMethodsSwitch,
    recurringPaymentMethods: PaymentMethodsSwitch,
    experiments: Map[String, ExperimentSwitch],
    optimize: SwitchState,
    internationalSubscribePages: SwitchState
)

case class Settings(
    switches: Switches
)

object Settings {

  def fromDiskOrS3(config: Config)(implicit s3: AmazonS3): Either[Throwable, Settings] =
    for {
      source <- AdminSettingsSource.fromConfig(config)
      rawJson <- getRawJson(source)
      settings <- decodeJson(rawJson)
    } yield settings

  private def decodeJson(rawJson: String): Either[Throwable, Settings] = decode[Settings](rawJson)

  private def getRawJson(source: AdminSettingsSource)(implicit s3: AmazonS3): Either[Throwable, String] = source match {
    case S3(bucket, key) => Either.catchNonFatal {
      val inputStream = s3.getObject(bucket, key).getObjectContent
      Source.fromInputStream(inputStream).mkString
    }
    case LocalFile(path) => Either.catchNonFatal {
      val homeDir = System.getProperty("user.home")
      val localPath = path.replaceFirst("~", homeDir)
      val bufferedSource = Source.fromFile(localPath)
      val rawJson = bufferedSource.getLines.mkString
      bufferedSource.close()
      rawJson
    }
  }
}

sealed trait AdminSettingsSource

case class S3(bucket: String, key: String) extends AdminSettingsSource
case class LocalFile(path: String) extends AdminSettingsSource

object AdminSettingsSource {

  def fromConfig(config: Config): Either[Throwable, AdminSettingsSource] =
    fromLocalFile(config).orElse(fromS3(config))

  private def fromLocalFile(config: Config): Either[Throwable, AdminSettingsSource] = Either.catchNonFatal {
    LocalFile(config.getString("adminSettingsSource.local.path"))
  }

  private def fromS3(config: Config): Either[Throwable, AdminSettingsSource] = Either.catchNonFatal {
    S3(
      config.getString("adminSettingsSource.s3.bucket"),
      config.getString("adminSettingsSource.s3.key"),
    )
  }

}

case class PaymentMethodsSwitch(stripe: SwitchState, payPal: SwitchState, directDebit: Option[SwitchState])
case class ExperimentSwitch(name: String, description: String, segment: Segment, state: SwitchState) {
  def isOn: Boolean = state == SwitchState.On

  private def checkHeader(segment: Segment, group: Group)(implicit request: RequestHeader): Boolean =
    request.headers.get("X-GU-Experiment").exists(_.contains(s"${segment.name}-${group.name}"))

  private def inVariant(implicit request: RequestHeader): Boolean = checkHeader(segment, Group.Variant)
  private def inControl(implicit request: RequestHeader): Boolean = checkHeader(segment, Group.Control)

  def canRun(implicit request: RequestHeader): Boolean = isOn
  def isParticipating(implicit request: RequestHeader): Boolean = canRun && inVariant
  def isControl(implicit request: RequestHeader): Boolean = canRun && inControl
  def value(implicit request: RequestHeader): Group = (isParticipating, isControl) match {
    case (true, _) => Group.Variant
    case (_, true) => Group.Control
    case _ => Group.Unknown
  }
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
      Segment.fromConfig(config, "segment"),
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

