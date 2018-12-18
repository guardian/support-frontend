package com.gu.support.workers.states

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.workers.CheckoutFailureReasons.CheckoutFailureReason
import com.gu.support.workers.User

case class CheckoutFailureState(user: User, checkoutFailureReason: CheckoutFailureReason) extends StepFunctionUserState

object CheckoutFailureState {
  implicit val decoder: Codec[CheckoutFailureState] = deriveCodec
}
