package com.gu.support.zuora.api

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.PaymentMethod

object SubscribeItem {
  implicit val codec: Codec[SubscribeItem] = capitalizingCodec
}

case class SubscribeItem(
  account: Account,
  billToContact: ContactDetails,
  soldToContact: Option[ContactDetails],
  paymentMethod: Option[PaymentMethod],
  subscriptionData: SubscriptionData,
  subscribeOptions: SubscribeOptions
)

object SubscribeRequest {
  implicit val codec: Codec[SubscribeRequest] = deriveCodec
}

//The subscribe request documented here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
//fields are upper case to match the expected json structure
case class SubscribeRequest(subscribes: List[SubscribeItem])
