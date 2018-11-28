package com.gu.support.workers.encoding

import com.gu.salesforce.Salesforce._
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.model.CheckoutFailureReasons._
import com.gu.support.workers.model.{CheckoutFailureReasons, Status}
import io.circe.{Decoder, Encoder}

object StateCodecs {

  implicit val encodeStatus: Encoder[Status] = Encoder.encodeString.contramap[Status](_.asString)

  implicit val decodeStatus: Decoder[Status] = Decoder.decodeString.emap {
    identifier => Status.fromString(identifier).toRight(s"Unrecognised status '$identifier'")
  }

  implicit val encodeFailureReason: Encoder[CheckoutFailureReason] = Encoder.encodeString.contramap[CheckoutFailureReason](_.asString)

  implicit val decodeFailureReason: Decoder[CheckoutFailureReason] = Decoder.decodeString.emap {
    identifier => CheckoutFailureReasons.fromString(identifier).toRight(s"Unrecognised failure reason '$identifier'")
  }
}
