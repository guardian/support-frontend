package com.gu.support.workers.model.state

import com.gu.support.workers.model.{Contribution, PaymentMethod, User}

case class CreateSalesforceContactState(
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod
) extends StepFunctionUserState