package admin

import scala.io.Source
import com.typesafe.config.Config
import collection.JavaConverters._
import play.api.mvc.RequestHeader
import codecs.CirceDecoders._
import io.circe.parser._
import cats.implicits._
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
  def fromConfig(config: Config): Settings =
    Settings(
      Switches(
        PaymentMethodsSwitch.fromConfig(config.getConfig("oneOff")),
        PaymentMethodsSwitch.fromConfig(config.getConfig("recurring")),
        experimentsFromConfig(config, "abtests"),
        SwitchState.fromConfig(config, "optimize"),
        SwitchState.fromConfig(config, "internationalSubscribePages")
      )
    )

  def fromDiskOrS3(adminSettingsSource: Config): Either[String, Settings] = {
    val rawJson = if (adminSettingsSource.hasPath("local.path")) {
      val homeDir = System.getProperty("user.home")
      val localPath = adminSettingsSource.getString("local.path").replaceFirst("~", homeDir)
      val bufferedSource = Source.fromFile(localPath)
      val json = bufferedSource.getLines.mkString
      bufferedSource.close()

      json
    } else ""

    val paymentMethodsSwitchAsJson = PaymentMethodsSwitch(SwitchState.On, SwitchState.On, None).asJson

    decode[PaymentMethodsSwitch](paymentMethodsSwitchAsJson.toString)
      .leftMap(err => {
        println("payment method error")
        println(err)
        err.getMessage
      })
      .map(paymentMethods => {
        println("payment methods success")
        println(paymentMethods)
        paymentMethods
      })

    decode[Settings](rawJson)
      .leftMap(err => {
        println("error")
        println(err)
        err.getMessage
      })
      .map(settings => {
        println(settings)
        settings
      })
  }

  def experimentsFromConfig(config: Config, rootKey: String): Map[String, ExperimentSwitch] =
    config.getConfigList(rootKey).asScala.map(ExperimentSwitch.fromConfig).map { x => x.name -> x }.toMap
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

