package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model.{ProductType, PaymentFields, User}

case class CreatePaymentMethodState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentFields: PaymentFields
) extends StepFunctionUserState