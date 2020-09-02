package com.gu.support.zuora.api.response

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs._
import org.joda.time.LocalDate

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

case class Subscription(contractAcceptanceDate: LocalDate, accountNumber: String, subscriptionNumber: String, status: String, CreatedRequestId__c: Option[String], ratePlans: List[RatePlan])

case class RatePlan(productId: String, productName: String, productRatePlanId: String)

