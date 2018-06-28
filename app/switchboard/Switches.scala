package switchboard

import com.typesafe.config.Config

case class Switches(onOffPaymentMethods: PaymentMethodsSwitch, recurringPaymentMethods: PaymentMethodsSwitch)

object Switches {
  def fromConfig(config: Config): Switches =
    Switches(
      PaymentMethodsSwitch.fromConfig(config.getConfig("oneOff")),
      PaymentMethodsSwitch.fromConfig(config.getConfig("recurring"))
    )
}

case class PaymentMethodsSwitch(stripe: SwitchState, payPal: SwitchState, directDebit: Option[SwitchState])

object PaymentMethodsSwitch {
  def fromConfig(config: Config): PaymentMethodsSwitch =
    PaymentMethodsSwitch(
      SwitchState.fromString(config.getString("stripe")),
      SwitchState.fromString(config.getString("payPal")),
      if (config.hasPath("directDebit"))
        Some(SwitchState.fromString(config.getString("directDebit")))
      else
        None
    )
}

sealed trait SwitchState

object SwitchState {
  def fromString(s: String): SwitchState = if (s.toLowerCase == "on") On else Off

  case object On extends SwitchState

  case object Off extends SwitchState

}

