package com.gu.support.workers.model.state

import com.gu.support.workers.model.{Contribution, PaymentMethod, SalesforceContactRecord, User}

case class SendThankYouEmailState(
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord,
  accountNumber: String
) extends StepFunctionUserState

