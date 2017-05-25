package com.gu.support.workers.model.state

import com.gu.support.workers.model.{Contribution, PayPalPaymentFields, StripePaymentFields, User}

case class CreatePaymentMethodState(
  user: User,
  contribution: Contribution,
  paymentFields: Either[StripePaymentFields, PayPalPaymentFields]
) extends StepFunctionUserState