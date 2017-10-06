package com.gu.support.workers.model.monthlyContributions.state

import java.util.UUID

import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.{NonPaymentAcquisitionData, PaymentMethod, User}

case class CreateSalesforceContactState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  nonPaymentAcquisitionData: Option[NonPaymentAcquisitionData]
) extends StepFunctionUserState