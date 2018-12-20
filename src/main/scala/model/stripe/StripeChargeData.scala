package model.stripe

import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.Decoder
import io.circe.generic.JsonCodec
import io.circe.generic.semiauto._
import model.Currency.findValues
import model.{AcquisitionData, Currency}
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event.{AbTest, AcquisitionSource, QueryParameter}

import scala.collection.immutable.IndexedSeq

object StripeJsonDecoder {

  import controllers.JsonReadableOps._

  // This will decode Stripe charge data in the format expected by the old contributions-frontend API.
  private val legacyStripeChargeDataDecoder: Decoder[StripeChargeData] = Decoder.instance { cursor =>
    import cursor._
    for {
      currency <- downField("currency").as[String]
      amount <- downField("amount").as[BigDecimal]
      token <- downField("token").as[String]
      email <- downField("email").as[String]
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
    } yield {
      StripeChargeData(
        paymentData = StripePaymentData(
          email = email,
          currency = Currency.withName(currency),
          amount = amount,
          token = token,
          // This will never be sent from the old contributions-frontend API.
          stripePaymentMethod = None
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
        signedInUserEmail = None
      )
    }
  }

  implicit val stripeChargeDataDecoder: Decoder[StripeChargeData] = legacyStripeChargeDataDecoder.or(deriveDecoder[StripeChargeData])
}

// https://stripe.com/docs/api/java#create_charge
@JsonCodec case class StripePaymentData(
  email: String,
  currency: Currency,
  amount: BigDecimal,
  token: String,
  stripePaymentMethod: Option[StripePaymentMethod])

sealed trait StripePaymentMethod extends EnumEntry

object StripePaymentMethod extends Enum[StripePaymentMethod] with CirceEnum[StripePaymentMethod] {

  override val values: IndexedSeq[StripePaymentMethod] = findValues

  case object StripeCheckout extends StripePaymentMethod

  case object StripeApplePay extends StripePaymentMethod

  case object StripePaymentRequestButton extends StripePaymentMethod

}
// Fields are grouped by what they're used for:
// - paymentData - required to create a Stripe charge
// - acquisitionData - required to create an acquisition event (used for analytics)
// - identityData
case class StripeChargeData(
    paymentData: StripePaymentData,
    acquisitionData: AcquisitionData,
    signedInUserEmail: Option[String]
)