package com.gu.support.workers.encoding

import com.gu.salesforce.Salesforce._
import com.gu.support.workers.encoding.Helpers.deriveCodec
import com.gu.support.workers.model.monthlyContributions.state._
import com.gu.support.workers.model.monthlyContributions.Status
import com.gu.zuora.encoding.CustomCodecs._
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._

object StateCodecs {

  implicit val encodeStatus: Encoder[Status] = Encoder.encodeString.contramap[Status](_.asString)

  implicit val decodeCurrency: Decoder[Status] =
    Decoder.decodeString.emap { identifier => Status.fromString(identifier).toRight(s"Unrecognised status '$identifier'") }

  implicit val createPaymentMethodState: Decoder[CreatePaymentMethodState] = deriveDecoder
  implicit val createSalesforceContactStateCodec: Codec[CreateSalesforceContactState] = deriveCodec
  implicit val createZuoraSubscriptionStateCodec: Codec[CreateZuoraSubscriptionState] = deriveCodec
  implicit val sendThankYouEmailStateCodec: Codec[SendThankYouEmailState] = deriveCodec
  implicit val updateMembersDataApiStateCodec: Codec[UpdateMembersDataAPIState] = deriveCodec
  implicit val failureHandlerStateCodec: Codec[FailureHandlerState] = deriveCodec
  implicit val completedStateCodec: Codec[CompletedState] = deriveCodec[CompletedState]
  implicit val sendAcquisitionEventStateDecoder: Decoder[SendAcquisitionEventState] = deriveDecoder
}
