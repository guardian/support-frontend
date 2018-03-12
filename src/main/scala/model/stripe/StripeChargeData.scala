package model.stripe

import io.circe.Decoder
import io.circe.generic.JsonCodec
import io.circe.generic.semiauto._
import model.{AcquisitionData, Currency}
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event.{AbTest, AcquisitionSource}

object StripeJsonDecoder {

  import controllers.JsonReadableOps._

  // This will decode Stripe charge data in the format expected by the old contributions-frontend API.
  private val legacyStripeChargeDataDecoder: Decoder[StripeChargeData] = Decoder.instance { cursor =>
    import cursor._
    for {
      currency <- downField("currency").as[String]
      amount <- downField("amount").as[Int]
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
    } yield {
      StripeChargeData(
        paymentData = StripePaymentData(
          email = email,
          currency = Currency.withName(currency),
          amount = amount,
          token = token
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
            .filter(_.nonEmpty)
        )
      )
    }
  }

  implicit val stripeChargeDataDecoder: Decoder[StripeChargeData] = legacyStripeChargeDataDecoder.or(deriveDecoder[StripeChargeData])
}

// https://stripe.com/docs/api/java#create_charge
@JsonCodec case class StripePaymentData(
    email: String,
    currency: Currency,
    amount: Int,
    token: String
)

// Fields are grouped by what they're used for:
// - paymentData - required to create a Stripe charge
// - acquisitionData - required to create an acquisition event (used for analytics)
// - identityData
case class StripeChargeData(
    paymentData: StripePaymentData,
    acquisitionData: AcquisitionData
)