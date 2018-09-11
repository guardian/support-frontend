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
  def fromDiskOrS3(config: Config)(implicit s3: AmazonS3): Either[Throwable, Settings] = {
    val adminSettingsSource: Either[Throwable, AdminSettingsSource] = if (config.hasPath("local.path")) {
      AdminSettingsSource.fromDisk(config.getString("local.path"))
    } else if (config.hasPath("s3")) {
      AdminSettingsSource.fromS3(config.getString("s3.bucket"), config.getString("s3.key"), s3)
    } else {
      Left(new Error("Need adminSettingsSource.local or adminSettingsSource.s3 defined in config"))
    }

    adminSettingsSource.flatMap(settingsSource =>
      decode[Settings](settingsSource.rawJson)
        .leftMap(err => new Error(s"Error decoding settings JSON at ${settingsSource.path}. Circe error: ${err.getMessage}")))
  }
}

case class AdminSettingsSource(
    path: String,
    rawJson: String
)

object AdminSettingsSource {
  def fromDisk(path: String): Either[Throwable, AdminSettingsSource] = {
    val homeDir = System.getProperty("user.home")
    val localPath = path.replaceFirst("~", homeDir)

    Either.catchNonFatal {
      val bufferedSource = Source.fromFile(localPath)
      val json = bufferedSource.getLines.mkString
      bufferedSource.close()
      AdminSettingsSource(localPath, json)
    }.leftMap(err => new Error(s"Could not fetch admin settings from $localPath. $err"))
  }

  def fromS3(bucket: String, key: String, s3: AmazonS3): Either[Throwable, AdminSettingsSource] = {
    val s3Path = s"s3://$bucket/$key"

    Either.catchNonFatal {
      val inputStream = s3.getObject(bucket, key).getObjectContent
      AdminSettingsSource(
        s3Path,
        Source.fromInputStream(inputStream).mkString
      )
    }.leftMap(err => new Error(s"Could not fetch admin settings from $s3Path. $err"))
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

