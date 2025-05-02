package model.stripe

import com.gu.support.acquisitions.{AbTest, QueryParameter}
import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.{Codec, Decoder, Encoder}
import io.circe.generic.JsonCodec
import io.circe.generic.semiauto._
import model.{AcquisitionData, Currency}

import scala.collection.immutable.IndexedSeq

class NonEmptyString(val value: String) extends AnyVal {
  override def toString(): String = value
}

object NonEmptyString {
  implicit val decoder: Decoder[NonEmptyString] = Decoder.decodeString
    .ensure(_.nonEmpty, s"Empty string is not permitted for this field")
    .map(s => new NonEmptyString(s))

  implicit val encoder: Encoder[NonEmptyString] = Encoder.encodeString.contramap(_.value)
  def apply(value: String): NonEmptyString = {
    require(value.nonEmpty, "Empty string is not permitted for this field")
    new NonEmptyString(value)
  }
}

trait BaseStripePaymentData {
  def email: NonEmptyString
  def currency: Currency
  def amount: BigDecimal
  def stripePaymentMethod: Option[StripePaymentMethod]
}

@JsonCodec case class StripePaymentData(
    email: NonEmptyString,
    currency: Currency,
    amount: BigDecimal,
    stripePaymentMethod: Option[StripePaymentMethod],
) extends BaseStripePaymentData

sealed trait StripePaymentMethod extends EnumEntry

object StripePaymentMethod extends Enum[StripePaymentMethod] with CirceEnum[StripePaymentMethod] {

  override val values: IndexedSeq[StripePaymentMethod] = findValues

  case object StripeCheckout extends StripePaymentMethod

  case object StripeApplePay extends StripePaymentMethod

  case object StripePaymentRequestButton extends StripePaymentMethod

}

case class StripePublicKey(value: String) extends AnyVal
object StripePublicKey {
  implicit val decoder: Decoder[StripePublicKey] = Decoder.decodeString.map(StripePublicKey.apply)
  implicit val encoder: Encoder[StripePublicKey] = Encoder.encodeString.contramap(_.value)
}

// Trait for modelling client requests for Stripe payments. This file can be simplified once we have moved away from
// the Stripe Charges API, but it's still required for mobile apps payments.
sealed trait StripeRequest {
  val paymentData: BaseStripePaymentData // data required to create a Stripe payment
  val acquisitionData: AcquisitionData // data required to create an acquisition event (used for analytics)
  val publicKey: Option[StripePublicKey] // required to determine which Stripe service to use
}

// Models for the Stripe Payment Intents API
object StripePaymentIntentRequest {

  case class CreatePaymentIntent(
      paymentMethodId: String,
      paymentData: StripePaymentData,
      acquisitionData: AcquisitionData,
      publicKey: Option[StripePublicKey],
      recaptchaToken: String,
  ) extends StripeRequest

  case class ConfirmPaymentIntent(
      paymentIntentId: String,
      paymentData: StripePaymentData,
      acquisitionData: AcquisitionData,
      publicKey: Option[StripePublicKey],
  ) extends StripeRequest

  import controllers.JsonReadableOps._
  implicit val createPaymentIntentDecoder: Codec[CreatePaymentIntent] = deriveCodec[CreatePaymentIntent]
  implicit val confirmPaymentIntent: Decoder[ConfirmPaymentIntent] = deriveDecoder[ConfirmPaymentIntent]
}
