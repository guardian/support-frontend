package com.gu.support.workers.encoding

import com.gu.salesforce.Salesforce._
import com.gu.support.workers.encoding.Helpers.deriveCodec
import com.gu.support.workers.model.CheckoutFailureReasons._
import com.gu.support.workers.model.{CheckoutFailureReasons, Status}
import com.gu.support.workers.model.states._
import com.gu.zuora.encoding.CustomCodecs._
import io.circe.generic.semiauto._
import io.circe.syntax._
import io.circe.{ACursor, Decoder, Encoder, Json}

object StateCodecs {

  implicit val encodeStatus: Encoder[Status] = Encoder.encodeString.contramap[Status](_.asString)

  implicit val decodeStatus: Decoder[Status] = Decoder.decodeString.emap {
    identifier => Status.fromString(identifier).toRight(s"Unrecognised status '$identifier'")
  }

  implicit val encodeFailureReason: Encoder[CheckoutFailureReason] = Encoder.encodeString.contramap[CheckoutFailureReason](_.asString)

  implicit val decodeFailureReason: Decoder[CheckoutFailureReason] = Decoder.decodeString.emap {
    identifier => CheckoutFailureReasons.fromString(identifier).toRight(s"Unrecognised failure reason '$identifier'")
  }

  //We need a custom decoder for CreatePaymentMethodState and FailureHandlerState because both lambdas must be able to handle old and new schemas
  implicit val createPaymentMethodStateDecoder: Decoder[CreatePaymentMethodState] = deriveDecoder[CreatePaymentMethodState].prepare(handleTwoSchemas(_))

  implicit val failureHandlerStateCodec: Decoder[FailureHandlerState] = deriveDecoder[FailureHandlerState].prepare(handleTwoSchemas(_))

  private def handleTwoSchemas(top: ACursor) = {
    val contribution = top.downField("contribution").as[Json]
    contribution.fold(
      _ => top, //This input doesn't contain the contribution key so it is the new schema
      contributionJson => top.withFocus(convertContributionToProduct(_, contributionJson)) //This input does contain the contribution key, migrate it
    )
  }

  private def convertContributionToProduct(top: Json, contributionJson: Json) =
    top.asObject.map(topObject =>
      topObject
        .add("product", contributionJson)
        .remove("contribution")
        .asJson).getOrElse(top)

  implicit val createSalesforceContactStateCodec: Codec[CreateSalesforceContactState] = deriveCodec
  implicit val createZuoraSubscriptionStateCodec: Codec[CreateZuoraSubscriptionState] = deriveCodec
  implicit val sendThankYouEmailStateCodec: Codec[SendThankYouEmailState] = deriveCodec
  implicit val sendAcquisitionEventStateDecoder: Decoder[SendAcquisitionEventState] = deriveDecoder
  implicit val checkoutFailureStateDecoder: Codec[CheckoutFailureState] = deriveCodec
}
