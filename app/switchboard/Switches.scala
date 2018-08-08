package switchboard

import com.typesafe.config.Config

case class Switches(
    oneOffPaymentMethods: PaymentMethodsSwitch,
    recurringPaymentMethods: PaymentMethodsSwitch,
    serverSideExperiments: SwitchState,
    optimize: SwitchState
)

object Switches {
  def fromConfig(config: Config): Switches =
    Switches(
      PaymentMethodsSwitch.fromConfig(config.getConfig("oneOff")),
      PaymentMethodsSwitch.fromConfig(config.getConfig("recurring")),
      SwitchState.fromConfig(config, "abtests"),
      SwitchState.fromConfig(config, "optimize")
    )

}

case class PaymentMethodsSwitch(stripe: SwitchState, payPal: SwitchState, directDebit: Option[SwitchState])
case class Switch(name: String, description: String, state: SwitchState) {
  def isOn = state == SwitchState.On
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

sealed trait SwitchState {
  def isOn: Boolean
}

object SwitchState {
  def fromConfig(config: Config, path: String): SwitchState = fromString(config.getString(path))

  def fromString(s: String): SwitchState = if (s.toLowerCase == "on") On else Off

  case object On extends SwitchState { val isOn = true }

  case object Off extends SwitchState { val isOn = false }

}

