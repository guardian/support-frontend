package com.gu.support.workers.model.monthlyContributions.state

import java.util.UUID

import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.{NonPaymentAcquisitionData, PaymentMethod, SalesforceContactRecord, User}

case class SendThankYouEmailState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord,
  accountNumber: String,
  nonPaymentAcquisitionData: Option[NonPaymentAcquisitionData]
) extends StepFunctionUserState

