package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model.{PaymentMethod, User}

case class CreateSalesforceContactState(
  requestId: UUID,
  user: User,
  product: Product,
  paymentMethod: PaymentMethod
) extends StepFunctionUserState