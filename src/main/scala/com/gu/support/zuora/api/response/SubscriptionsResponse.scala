package com.gu.support.zuora.api.response

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SubscriptionsResponse {
  implicit val codec: Codec[SubscriptionsResponse] = deriveCodec
}

object Subscription {
  implicit val codec: Codec[Subscription] = deriveCodec
}

object RatePlan {
  implicit val codec: Codec[RatePlan] = deriveCodec
}

case class SubscriptionsResponse(subscriptions: List[Subscription])

case class Subscription(accountNumber: String, status: String, ratePlans: List[RatePlan])

case class RatePlan(productId: String, productName: String, productRatePlanId: String)

