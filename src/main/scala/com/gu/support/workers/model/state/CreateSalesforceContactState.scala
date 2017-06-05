package com.gu.support.workers.model.state

import java.util.UUID

import com.gu.support.workers.model.{Contribution, PaymentMethod, User}

case class CreateSalesforceContactState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod
) extends StepFunctionUserState