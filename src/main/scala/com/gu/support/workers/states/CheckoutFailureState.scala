package com.gu.support.workers.states

import com.gu.support.workers.User
import com.gu.support.workers.CheckoutFailureReasons.CheckoutFailureReason

case class CheckoutFailureState(user: User, checkoutFailureReason: CheckoutFailureReason) extends StepFunctionUserState


