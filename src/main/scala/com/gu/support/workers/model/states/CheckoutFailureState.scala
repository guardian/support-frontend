package com.gu.support.workers.model.states

import com.gu.support.workers.model.CheckoutFailureReasons.CheckoutFailureReason
import com.gu.support.workers.model.User

case class CheckoutFailureState(user: User, checkoutFailureReason: CheckoutFailureReason) extends StepFunctionUserState


