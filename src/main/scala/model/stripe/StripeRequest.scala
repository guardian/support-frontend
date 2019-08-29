package model.stripe

import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.{Decoder, Encoder}
import io.circe.generic.JsonCodec
import io.circe.generic.semiauto._
import model.{AcquisitionData, Currency}
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event.{AbTest, AcquisitionSource, QueryParameter}

import scala.collection.immutable.IndexedSeq

object StripeJsonDecoder {

  import controllers.JsonReadableOps._
  import NonEmptyString.decoder
  import StripePublicKey.decoder

  // This will decode Stripe charge data in the format expected by the old contributions-frontend API.
  private val legacyStripeChargeDataDecoder: Decoder[LegacyStripeChargeRequest] = Decoder.instance { cursor =>
    import cursor._
    for {
      currency <- downField("currency").as[String]
      amount <- downField("amount").as[BigDecimal]
      token <- downField("token").as[NonEmptyString]
      email <- downField("email").as[NonEmptyString]
      browserId <- downField("ophanBrowserId").as[Option[String]]
      visitId <- downField("ophanVisitId").as[Option[String]]
      pageviewId <- downField("ophanPageviewId").as[Option[String]]
      referrerPageviewId <- downField("refererPageviewId").as[Option[String]]
      refererUrl <- downField("refererUrl").as[Option[String]]
      cmp <- downField("cmp").as[Option[String]]
      intcmp <- downField("intcmp").as[Option[String]]
      platform <- downField("platform").as[Option[String]]
      componentId <- downField("componentId").as[Option[String]]
      componentType <- downField("componentType").as[Option[ComponentType]]
      source <- downField("source").as[Option[AcquisitionSource]]
      identityId <- downField("idUser").as[Option[String]]
      abTest <- downField("abTest").as[Option[AbTest]]
      refererAbTest <- downField("refererAbTest").as[Option[AbTest]]
      nativeAbTests <- downField("nativeAbTests").as[Option[Set[AbTest]]]
      queryParameters <- downField("queryParameters").as[Option[Set[QueryParameter]]]
      gaId <- downField("gaId").as[Option[String]]
      stripePaymentMethod <- downField("stripePaymentMethod").as[Option[StripePaymentMethod]]
      stripePublicKey <- downField("publicKey").as[Option[StripePublicKey]]
    } yield {
      LegacyStripeChargeRequest(
        paymentData = StripePaymentData(
          email = email,
          currency = Currency.withName(currency),
          amount = amount,
          token = token,
          stripePaymentMethod = stripePaymentMethod
        ),
        acquisitionData = AcquisitionData(
          platform = platform,
          visitId = visitId,
          browserId = browserId,
          pageviewId = pageviewId,
          referrerPageviewId = referrerPageviewId,
          referrerUrl = refererUrl,
          componentId = componentId,
          campaignCodes = Option(Set(cmp, intcmp).flatten).filter(_.nonEmpty),
          componentType = componentType,
          source = source,
          abTests = Option(Set(abTest, refererAbTest).flatten ++ nativeAbTests
            .getOrElse(Set[AbTest]()))
            .filter(_.nonEmpty),
          queryParameters = queryParameters,
          gaId = gaId
        ),
        publicKey = stripePublicKey
      )
    }
  }

  implicit val stripeChargeDataDecoder: Decoder[LegacyStripeChargeRequest] = legacyStripeChargeDataDecoder.or(deriveDecoder[LegacyStripeChargeRequest])
}

// Private because it should only be constructed using the accompanying Decoder
class NonEmptyString private(val value: String) extends AnyVal

object NonEmptyString {
  implicit val decoder: Decoder[NonEmptyString] = Decoder.decodeString
    .ensure(_.nonEmpty, s"Empty string is not permitted for this field")
    .map(s => new NonEmptyString(s))

  implicit val encoder: Encoder[NonEmptyString] = Encoder.encodeString.contramap(_.value)
}

// https://stripe.com/docs/api/java#create_charge
@JsonCodec case class StripePaymentData(
  email: NonEmptyString,  //for receipt_email
  currency: Currency,
  amount: BigDecimal,
  token: NonEmptyString,  //This field will be deprecated once the migration to Stripe Payment Intents is complete
  stripePaymentMethod: Option[StripePaymentMethod])

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
}

// Trait for modelling client requests for Stripe payments. This file can be simplified once we have moved away from
// the Stripe Charges API.
sealed trait StripeRequest {
  val paymentData: StripePaymentData      //data required to create a Stripe payment
  val acquisitionData: AcquisitionData    //data required to create an acquisition event (used for analytics)
  val publicKey: Option[StripePublicKey]  //required to determine which Stripe service to use
}

// Legacy model for Stripe Charges API
case class LegacyStripeChargeRequest(
  paymentData: StripePaymentData,
  acquisitionData: AcquisitionData,
  publicKey: Option[StripePublicKey]) extends StripeRequest

// Models for the Stripe Payment Intents API
object StripePaymentIntentRequest {

  case class CreatePaymentIntent(
    paymentMethodId: String,
    paymentData: StripePaymentData,
    acquisitionData: AcquisitionData,
    publicKey: Option[StripePublicKey]) extends StripeRequest

  case class ConfirmPaymentIntent(
    paymentIntentId: String,
    paymentData: StripePaymentData,
    acquisitionData: AcquisitionData,
    publicKey: Option[StripePublicKey]) extends StripeRequest

  import controllers.JsonReadableOps._
  implicit val createPaymentIntentDecoder = deriveDecoder[CreatePaymentIntent]
  implicit val confirmPaymentIntent = deriveDecoder[ConfirmPaymentIntent]
}
