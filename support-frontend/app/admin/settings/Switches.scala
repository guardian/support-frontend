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
    enableQuantumMetric: Option[SwitchState],
    usStripeAccountForSingle: Option[SwitchState],
    authenticateWithOkta: Option[SwitchState],
)

case class CampaignSwitches(
    enableContributionsCampaign: Option[SwitchState],
    forceContributionsCampaign: Option[SwitchState],
)

case class SubscriptionsSwitches(
    enableDigitalSubGifting: Option[SwitchState],
    useDotcomContactPage: Option[SwitchState],
    checkoutPostcodeLookup: Option[SwitchState],
)

case class RecaptchaSwitches(
    enableRecaptchaBackend: Option[SwitchState],
    enableRecaptchaFrontend: Option[SwitchState],
)

case class OneOffPaymentMethodSwitches(
    stripe: Option[SwitchState],
    stripeApplePay: Option[SwitchState],
    stripePaymentRequestButton: Option[SwitchState],
    // @see https://docs.stripe.com/elements/express-checkout-element
    stripeExpressCheckout: Option[SwitchState],
    payPal: Option[SwitchState],
    amazonPay: Option[SwitchState],
)

case class RecurringPaymentMethodSwitches(
    stripe: Option[SwitchState],
    stripeApplePay: Option[SwitchState],
    stripePaymentRequestButton: Option[SwitchState],
    // @see https://docs.stripe.com/elements/express-checkout-element
    stripeExpressCheckout: Option[SwitchState],
    payPal: Option[SwitchState],
    directDebit: Option[SwitchState],
    amazonPay: Option[SwitchState],
    sepa: Option[SwitchState],
)

case class SubscriptionsPaymentMethodSwitches(
    directDebit: Option[SwitchState],
    creditCard: Option[SwitchState],
    paypal: Option[SwitchState],
)

case class Switches(
    oneOffPaymentMethods: OneOffPaymentMethodSwitches,
    recurringPaymentMethods: RecurringPaymentMethodSwitches,
    subscriptionsPaymentMethods: SubscriptionsPaymentMethodSwitches,
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
