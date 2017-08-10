package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model.{PaymentFields, User}

case class CreatePaymentMethodState(
  requestId: UUID,
  user: User,
  product: Product,
  paymentFields: PaymentFields
) extends StepFunctionUserState