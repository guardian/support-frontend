package com.gu.zuora.model

import com.gu.support.workers.model.PaymentMethod
import com.gu.zuora.encoding.CapitalizationEncoder._
import io.circe.generic.semiauto._
import com.gu.zuora.encoding.CustomCodecs._
import io.circe.{Decoder, Encoder}

object SubscribeItem {
  implicit val encoder: Encoder[SubscribeItem] = capitalizingEncoder
  implicit val decoder: Decoder[SubscribeItem] = decapitalizingDecoder
}

case class SubscribeItem(
  account: Account,
  billToContact: ContactDetails,
  paymentMethod: PaymentMethod,
  subscriptionData: SubscriptionData,
  subscribeOptions: SubscribeOptions
)

object SubscribeRequest {
  implicit val encoder: Encoder[SubscribeRequest] = deriveEncoder
  implicit val decoder: Decoder[SubscribeRequest] = deriveDecoder
}
//The subscribe request documented here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
//fields are upper case to match the expected json structure
case class SubscribeRequest(subscribes: List[SubscribeItem])