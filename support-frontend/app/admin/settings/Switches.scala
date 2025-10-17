package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.optics.JsonPath.root
import io.circe.{Decoder, Encoder, Json}

sealed abstract class SwitchState(val isOn: Boolean)
case object On extends SwitchState(true)
case object Off extends SwitchState(false)

object SwitchState {
  implicit val encodeSwitch: Encoder[SwitchState] = Encoder.encodeString.contramap[SwitchState] { state =>
    if (state.isOn) "On" else "Off"
  }
  implicit val decodeSwitch: Decoder[SwitchState] = Decoder.decodeString.emap { value =>
    if (value == "On") Right(On) else Right(Off)
  }
}

case class FeatureSwitches(
    enableQuantumMetric: Option[SwitchState],
    usStripeAccountForSingle: Option[SwitchState],
    authenticateWithOkta: Option[SwitchState],
    enableCampaignCountdown: Option[SwitchState],
    enableThankYouOnboarding: Option[SwitchState],
)

object FeatureSwitches {
  implicit val featureSwitchesCodec: Codec[FeatureSwitches] = deriveCodec
}

case class CampaignSwitches(
    enableContributionsCampaign: Option[SwitchState],
    forceContributionsCampaign: Option[SwitchState],
)

object CampaignSwitches {
  implicit val campaignSwitchesCodec: Codec[CampaignSwitches] = deriveCodec
}

case class SubscriptionsSwitches(
    useDotcomContactPage: Option[SwitchState],
    checkoutPostcodeLookup: Option[SwitchState],
)

object SubscriptionsSwitches {
  implicit val subscriptionsSwitchesCodec: Codec[SubscriptionsSwitches] = deriveCodec
}

case class RecaptchaSwitches(
    enableRecaptchaBackend: Option[SwitchState],
    enableRecaptchaFrontend: Option[SwitchState],
)

object RecaptchaSwitches {
  implicit val recaptchaSwitchesCodec: Codec[RecaptchaSwitches] = deriveCodec
}

case class OneOffPaymentMethodSwitches(
    stripe: Option[SwitchState],
    // @see https://docs.stripe.com/elements/express-checkout-element
    stripeExpressCheckout: Option[SwitchState],
    payPal: Option[SwitchState],
)

object OneOffPaymentMethodSwitches {
  implicit val oneOffPaymentMethodSwitchesCodec: Codec[OneOffPaymentMethodSwitches] = deriveCodec
}

case class RecurringPaymentMethodSwitches(
    stripe: Option[SwitchState],
    stripeApplePay: Option[SwitchState],
    stripePaymentRequestButton: Option[SwitchState],
    // @see https://docs.stripe.com/elements/express-checkout-element
    stripeExpressCheckout: Option[SwitchState],
    payPal: Option[SwitchState],
    directDebit: Option[SwitchState],
    sepa: Option[SwitchState],
    stripeHostedCheckout: Option[SwitchState],
)

object RecurringPaymentMethodSwitches {
  implicit val recurringPaymentMethodSwitchesCodec: Codec[RecurringPaymentMethodSwitches] = deriveCodec
}

// TODO: these should be consolidated with the above RecurringPaymentMethodSwitches.
// Currently those are used on the client while these are used on the server, which means both switches
// need to be enabled for a payment method to be used.
case class SubscriptionsPaymentMethodSwitches(
    directDebit: Option[SwitchState],
    creditCard: Option[SwitchState],
    paypal: Option[SwitchState],
    stripeHostedCheckout: Option[SwitchState],
)

object SubscriptionsPaymentMethodSwitches {
  implicit val subscriptionsPaymentMethodSwitchesCodec: Codec[SubscriptionsPaymentMethodSwitches] = deriveCodec
}

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

  private val switchesEncoder: Encoder[Switches] = deriveEncoder
  private val switchesDecoder: Decoder[Switches] = deriveDecoder[Switches].prepare(_.withFocus(flattenAllSwitches))

  implicit val switchesCodec: Codec[Switches] = new Codec(switchesEncoder, switchesDecoder)
}
