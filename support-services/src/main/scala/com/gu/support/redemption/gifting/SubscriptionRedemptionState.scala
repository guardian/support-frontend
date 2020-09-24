package com.gu.support.redemption.gifting

sealed abstract class SubscriptionRedemptionState(val clientCode: String)

object Unredeemed {
  val clientCode = "unredeemed"
}

case class Unredeemed(subscriptionId: String) extends SubscriptionRedemptionState(Unredeemed.clientCode)

// This can happen if Zuora is responding very slowly - a redemption request may succeed but not return a response
// until after the CreateZuoraSubscription lambda has timed out meaning that the redemption will be retried with the
// same requestId. In this case we want the lambda to succeed so that we progress to the next lambda
case object RedeemedInThisRequest extends SubscriptionRedemptionState("redeemed_in_this_request")

case object Redeemed extends SubscriptionRedemptionState("redeemed")

case object Expired extends SubscriptionRedemptionState("expired")

case object NotFound extends SubscriptionRedemptionState("not_found")
