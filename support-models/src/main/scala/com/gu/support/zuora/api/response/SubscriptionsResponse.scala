package com.gu.support.zuora.api.response

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs._
import org.joda.time.LocalDate

object SubscriptionsResponse {
  implicit val codec: Codec[SubscriptionsResponse] = deriveCodec
}

case class SubscriptionsResponse(subscriptions: List[Subscription])

object Subscription {
  implicit val codec: Codec[Subscription] = deriveCodec
}

case class Subscription(
    customerAcceptanceDate: LocalDate,
    accountNumber: String,
    subscriptionNumber: String,
    status: String,
    CreatedRequestId__c: Option[String],
    ratePlans: List[RatePlan],
)

object RatePlan {
  implicit val codec: Codec[RatePlan] = deriveCodec
}

case class RatePlan(
    productId: String,
    productName: String,
    productRatePlanId: String,
    ratePlanCharges: List[RatePlanCharge],
)

object RatePlanCharge {
  implicit val codec: Codec[RatePlanCharge] = deriveCodec
}

case class RatePlanCharge(id: String, name: String)
