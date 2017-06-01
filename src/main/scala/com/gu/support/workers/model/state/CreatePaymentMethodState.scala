package com.gu.support.workers.model.state

import java.util.UUID

import com.gu.support.workers.model.{Contribution, PayPalPaymentFields, StripePaymentFields, User}

case class CreatePaymentMethodState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  paymentFields: Either[StripePaymentFields, PayPalPaymentFields]
) extends StepFunctionUserState