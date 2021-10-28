package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec

case class Switches(
  oneOffPaymentMethods: PaymentMethodsSwitch,
  recurringPaymentMethods: PaymentMethodsSwitch,
  enableDigitalSubGifting: SwitchState,
  useDotcomContactPage: Option[SwitchState],
  enableRecaptchaBackend: SwitchState,
  enableRecaptchaFrontend: SwitchState,
  experiments: Map[String, ExperimentSwitch],
  enableContributionsCampaign: SwitchState,
  forceContributionsCampaign: SwitchState,
  enableQuantumMetric: SwitchState
)

object Switches {
  implicit val switchesCodec: Codec[Switches] = deriveCodec
}
