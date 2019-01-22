package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec

case class Switches(
  oneOffPaymentMethods: PaymentMethodsSwitch,
  recurringPaymentMethods: PaymentMethodsSwitch,
  experiments: Map[String, ExperimentSwitch],
  optimize: SwitchState
)

object Switches {
  implicit val switchesCodec: Codec[Switches] = deriveCodec
}
