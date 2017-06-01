package com.gu.zuora.model

import com.gu.support.workers.model.PaymentMethod
import com.gu.zuora.encoding.CapitalizationEncoder._
import io.circe.generic.semiauto._
import com.gu.zuora.encoding.CustomCodecs._
import io.circe.{Decoder, Encoder}
import com.gu.support.workers.encoding.Helpers.{capitalizingCodec, deriveCodec}
import com.gu.support.workers.encoding.Codec

object SubscribeItem {
  implicit val codec: Codec[SubscribeItem] = capitalizingCodec
}

case class SubscribeItem(
  account: Account,
  billToContact: ContactDetails,
  paymentMethod: PaymentMethod,
  subscriptionData: SubscriptionData,
  subscribeOptions: SubscribeOptions
)

object SubscribeRequest {
  implicit val codec: Codec[SubscribeRequest] = deriveCodec
}
//The subscribe request documented here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
//fields are upper case to match the expected json structure
case class SubscribeRequest(subscribes: List[SubscribeItem])