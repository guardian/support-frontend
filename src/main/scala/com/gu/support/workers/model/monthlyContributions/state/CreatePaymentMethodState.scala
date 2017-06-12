package com.gu.support.workers.model.monthlyContributions.state

import java.util.UUID

import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.{PayPalPaymentFields, StripePaymentFields, User}

case class CreatePaymentMethodState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  paymentFields: Either[StripePaymentFields, PayPalPaymentFields]
) extends StepFunctionUserState