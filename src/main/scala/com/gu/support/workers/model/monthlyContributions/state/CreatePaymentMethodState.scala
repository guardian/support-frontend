package com.gu.support.workers.model.monthlyContributions.state

import java.util.UUID

import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.{NonPaymentAcquisitionData, PayPalPaymentFields, StripePaymentFields, User}

case class CreatePaymentMethodState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  paymentFields: Either[StripePaymentFields, PayPalPaymentFields],
  nonPaymentAcquisitionData: Option[NonPaymentAcquisitionData]
) extends StepFunctionUserState