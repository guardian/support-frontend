package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model.{ProductType, PaymentMethod, User}

case class CreateSalesforceContactState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentMethod: PaymentMethod
) extends StepFunctionUserState