package com.gu.support.workers.model.state

import java.util.UUID

import com.gu.support.workers.model.{Contribution, PaymentMethod, SalesforceContactRecord, User}

case class SendThankYouEmailState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord,
  accountNumber: String
) extends StepFunctionUserState

