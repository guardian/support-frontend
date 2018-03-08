package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model.{AcquisitionData, PaymentFields, ProductType, User}

case class CreatePaymentMethodState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentFields: PaymentFields,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState