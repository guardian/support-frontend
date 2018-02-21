package model.stripe

import io.circe.Decoder
import io.circe.generic.JsonCodec
import io.circe.generic.semiauto._

import model.Currency

// https://stripe.com/docs/api/java#create_charge
@JsonCodec case class StripePaymentData(
    currency: Currency,
    amount: Int,
    source: String
)

// TODO: can this be used for both Stripe and Paypal payments?
@JsonCodec case class AcquisitionData(
    browserId: Option[String],
    visitId: Option[String],
    pageviewId: Option[String],
    referrerPageviewId: Option[String],
    referrerUrl: Option[String],
    // TODO: look into whether circe can handle empty sets without them being wrapped in an option
    campaignCodes: Option[Set[String]],
    // TODO: add these fields when dependency on acquisition-event-producer is added
    //platform: Option[String],
    //componentId: Option[String],
    //componentType: Option[String],
    //source: Option[String],
    //abTests: Option[Set[String]]
)

// TODO: can this be used for both Stripe and Paypal payments?
@JsonCodec case class IdentityData(
    identityId: Option[String],
    email: String
)

// Fields are grouped by what they're used for:
// - paymentData - required to create a Stripe charge
// - acquisitionData - required to create an acquisition event (used for analytics)
// - identityData - TODO: note about payment-api as an API to see if a user has contributed
case class StripeChargeData(
    paymentData: StripePaymentData,
    acquisitionData: AcquisitionData,
    identityData: IdentityData
)

object StripeChargeData {

  // This will decode Stripe charge data in the format expected by the old contributions-frontend API.
  private val legacyStripeChargeDataDecoder: Decoder[StripeChargeData] = Decoder.instance { cursor =>
    import cursor._
    for {
      currency <- downField("currency").as[Currency]
      amount <- downField("amount").as[Int]
      token <- downField("token").as[String]
      email <- downField("email").as[String]
      browserId <- downField("ophanBrowserId").as[Option[String]]
      visitId <- downField("ophanVisitId").as[Option[String]]
      pageviewId <- downField("ophanPageviewId").as[Option[String]]
      // Intentional typo in down field
      referrerPageviewId <- downField("refererPageviewId").as[Option[String]]
      // Intentional typo in down field
      referrerUrl <- downField("refererUrl").as[Option[String]]
      cmp <- downField("cmp").as[Option[String]]
      intcmp <- downField("intcmp").as[Option[String]]
      // TODO: add these fields when dependency on acquisition-event-producer is added
      //platform <- downField("platform").as[Option[String]]
      //componentId <- downField("componentId").as[Option[String]]
      //componentType <- downField("componentType").as[Option[String]]
      //source <- downField("source").as[Option[String]]
      identityId <- downField("idUser").as[Option[String]]
    } yield {
      StripeChargeData(
        paymentData = StripePaymentData(
          currency = currency,
          amount = amount,
          source = token
        ),
        acquisitionData = AcquisitionData(
          browserId = browserId,
          visitId = visitId,
          pageviewId = pageviewId,
          referrerPageviewId = referrerPageviewId,
          referrerUrl = referrerUrl,
          campaignCodes = Some(Set(cmp, intcmp).flatten)
        ),
        identityData = IdentityData(
          identityId = identityId,
          email = email
        )
      )
    }
  }

  // Use a decoder which falls back to the format expected by the contribution-frontend API.
  // Useful if the client hasn't sent Stripe charge data in the new format -
  // e.g. if a user is making a contribution through an old version of the native App.
  implicit val stripeChargeDataDecoder: Decoder[StripeChargeData] =
    // TODO: if both decoders fail, you only get the error message of the last decoder, which can be confusing.
    // One solution could be to have a route per JSON format (instead of one route for all formats).
    legacyStripeChargeDataDecoder.or(deriveDecoder[StripeChargeData])
}