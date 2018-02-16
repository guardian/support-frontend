package model.stripe

import io.circe.Decoder
import io.circe.generic.JsonCodec

import model.Currency

// https://stripe.com/docs/api/java#create_charge
@JsonCodec case class StripePaymentData(
    currency: Currency,
    amount: Int,
    source: String,
    email: String // TODO: should email be here or in identity data?
)

// TODO: can this be used for both Stripe and Paypal payments?
// TODO: correct types
// TODO: use acquisition event producer models to build this?
// TODO: model this case class as composite case classes?
@JsonCodec case class AcquisitionData(
    browserId: Option[String],
    visitId: Option[String],
    pageviewId: Option[String],
    referrerPageviewId: Option[String],
    referrerUrl: Option[String],
    // TODO: look into whether circe can handle empty sets without them being wrapped in an option
    campaignCodes: Option[Set[String]],
    platform: Option[String],
    componentId: Option[String],
    componentType: Option[String],
    source: Option[String],
    abTests: Option[Set[String]]
)

// TODO: can this be used for both Stripe and Paypal payments
@JsonCodec case class IdentityData(
    identityId: Option[String]
)

// Fields are either used to:
// - chargeData - required to create a Stripe charge
// - acquisitionData - required to create an acquisition event (used for analytics)
// - identityData - TODO: note about payment-api as an API to see if a user has contributed
@JsonCodec case class StripeChargeData(
    paymentData: StripePaymentData,
    acquisitionData: AcquisitionData,
    identityData: IdentityData
)

object StripeChargeData {

  object legacy {

    implicit val legacyStripeChargeDataDecoder: Decoder[StripeChargeData] = Decoder.instance { cursor =>
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
        platform <- downField("platform").as[Option[String]]
        componentId <- downField("componentId").as[Option[String]]
        componentType <- downField("componentType").as[Option[String]]
        source <- downField("source").as[Option[String]]
        // TODO: ab tests field
        // TODO: support field
        identityId <- downField("idUser").as[Option[String]]
      } yield {
        StripeChargeData(
          paymentData = StripePaymentData(
            currency = currency,
            amount = amount,
            source = token,
            email = email
          ),
          acquisitionData = AcquisitionData(
            browserId = browserId,
            visitId = visitId,
            pageviewId = pageviewId,
            referrerPageviewId = referrerPageviewId,
            referrerUrl = referrerUrl,
            campaignCodes = Some(Set(cmp, intcmp).flatten),
            platform = platform,
            componentId = componentId,
            componentType = componentType,
            source = source,
            abTests = None
          ),
          identityData = IdentityData(
            identityId = identityId
          )
        )
      }
    }
  }
}