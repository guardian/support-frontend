package admin.settings

import com.gu.support.encoding.Codec
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder, Json}
import io.circe.optics.JsonPath._

sealed abstract class SwitchState(val isOn: Boolean)
case object On extends SwitchState(true)
case object Off extends SwitchState(false)

object SwitchState {
  import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}
  implicit val stateDecoder: Decoder[SwitchState] = deriveEnumerationDecoder[SwitchState]
  implicit val stateEncoder: Encoder[SwitchState] = deriveEnumerationEncoder[SwitchState]
}

case class FeatureSwitches(
    enableQuantumMetric: SwitchState,
    usStripeAccountForSingle: SwitchState,
)

case class CampaignSwitches(
    enableContributionsCampaign: SwitchState,
    forceContributionsCampaign: SwitchState,
)

case class SubscriptionsSwitches(
    enableDigitalSubGifting: SwitchState,
    useDotcomContactPage: SwitchState,
    checkoutPostcodeLookup: SwitchState,
)

case class RecaptchaSwitches(
    enableRecaptchaBackend: SwitchState,
    enableRecaptchaFrontend: SwitchState,
)

case class OneOffPaymentMethodSwitches(
    stripe: SwitchState,
    stripeApplePay: SwitchState,
    stripePaymentRequestButton: SwitchState,
    payPal: SwitchState,
    amazonPay: SwitchState,
)

case class RecurringPaymentMethodSwitches(
    stripe: SwitchState,
    stripeApplePay: SwitchState,
    stripePaymentRequestButton: SwitchState,
    payPal: SwitchState,
    directDebit: SwitchState,
    existingCard: SwitchState,
    existingDirectDebit: SwitchState,
    amazonPay: SwitchState,
    sepa: SwitchState,
)

case class Switches(
    oneOffPaymentMethods: OneOffPaymentMethodSwitches,
    recurringPaymentMethods: RecurringPaymentMethodSwitches,
    subscriptionsSwitches: SubscriptionsSwitches,
    featureSwitches: FeatureSwitches,
    campaignSwitches: CampaignSwitches,
    recaptchaSwitches: RecaptchaSwitches,
)

object Switches {

  /** Transforms from e.g: { "oneOffPaymentMethods" : { "description" : "Payment methods - one-off contributions",
    * "switches" : { "stripe" : { "description" : "Stripe - Credit/Debit card", "state" : "On" } } } } To: {
    * "oneOffPaymentMethods" : { "stripe": "On" } }
    */
  private def flattenSwitchState(json: Json): Json =
    root.state.string
      .getOption(json)
      .map(Json.fromString)
      .getOrElse(json)

  private def flattenAllSwitches: Json => Json =
    root.each.obj.modify { switchGroup =>
      switchGroup("switches")
        .flatMap(_.asObject)
        .map(switches => switches.mapValues(flattenSwitchState))
        .getOrElse(switchGroup)
    }

  implicit private val customConfig: Configuration = Configuration.default.withDefaults

  private val switchesEncoder = Encoder[Switches]
  private val switchesDecoder = Decoder[Switches].prepare(_.withFocus(flattenAllSwitches))

  implicit val switchesCodec = new Codec(switchesEncoder, switchesDecoder)
}
