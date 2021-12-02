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
  import io.circe.generic.extras.semiauto.{ deriveEnumerationDecoder, deriveEnumerationEncoder }
  implicit val stateDecoder: Decoder[SwitchState] = deriveEnumerationDecoder[SwitchState]
  implicit val stateEncoder: Encoder[SwitchState] = deriveEnumerationEncoder[SwitchState]
}

case class FeatureSwitches(
  enableQuantumMetric: SwitchState = Off,
  usStripeAccountForSingle: SwitchState = On
)

case class CampaignSwitches(
  enableContributionsCampaign: SwitchState = Off,
  forceContributionsCampaign: SwitchState = Off
)

case class SubscriptionsSwitches(
  enableDigitalSubGifting: SwitchState = On,
  useDotcomContactPage: SwitchState = On,
  checkoutPostcodeLookup: SwitchState = On
)

case class RecaptchaSwitches(
  enableRecaptchaBackend: SwitchState = On,
  enableRecaptchaFrontend: SwitchState = On
)

case class OneOffPaymentMethodSwitches(
  stripe: SwitchState = On,
  stripeApplePay: SwitchState = On,
  stripePaymentRequestButton: SwitchState = On,
  payPal: SwitchState = On,
  amazonPay: SwitchState = On
)

case class RecurringPaymentMethodSwitches(
  stripe: SwitchState = On,
  stripeApplePay: SwitchState = On,
  stripePaymentRequestButton: SwitchState = On,
  payPal: SwitchState = On,
  directDebit: SwitchState = On,
  existingCard: SwitchState = On,
  existingDirectDebit: SwitchState = On,
  amazonPay: SwitchState = Off,
  sepa: SwitchState = Off
)

case class Switches(
  oneOffPaymentMethods: OneOffPaymentMethodSwitches,
  recurringPaymentMethods: RecurringPaymentMethodSwitches,
  subscriptionsSwitches: SubscriptionsSwitches,
  featureSwitches: FeatureSwitches,
  campaignSwitches: CampaignSwitches,
  recaptchaSwitches: RecaptchaSwitches
)

object Switches {
  /**
   * Transforms from e.g:
   *  {
   *    "oneOffPaymentMethods" : {
   *      "description" : "Payment methods - one-off contributions",
   *      "switches" : {
   *        "stripe" : {
   *          "description" : "Stripe - Credit/Debit card",
   *          "state" : "On"
   *        }
   *      }
   *    }
   *  }
   *  To:
   *  {
   *    "oneOffPaymentMethods" : {
   *      "stripe": "On"
   *    }
   *  }
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
