package switchboard

import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import switchboard.SwitchState.Off

class Switches(config: Config) {
  lazy val onOffPaymentMethods: PaymentMethodsSwitch = new PaymentMethodsSwitch(config.getConfig("oneOff"))
  lazy val recurringPaymentMethods: PaymentMethodsSwitch = new PaymentMethodsSwitch(config.getConfig("recurring"))
}

class PaymentMethodsSwitch(config: Config) {
  lazy val stripe: SwitchState = SwitchState.fromString(config.getString("stripe"))
  lazy val payPal: SwitchState = SwitchState.fromString(config.getString("payPal"))
  lazy val directDebit: SwitchState =
    if (config.hasPath("directDebit"))
      SwitchState.fromString(config.getString("directDebit"))
    else
      Off
}

sealed trait SwitchState

object SwitchState {
  def fromString(s: String): SwitchState = if (s.toLowerCase == "on") On else Off

  case object On extends SwitchState

  case object Off extends SwitchState

}

