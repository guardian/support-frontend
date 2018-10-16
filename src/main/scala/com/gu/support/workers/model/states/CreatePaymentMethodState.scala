package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model._

case class CreatePaymentMethodState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentFields: PaymentFields,
  acquisitionData: Option[AcquisitionData],
  accessScopeWithinIdentityId: AccessScopeWithinIdentityId
) extends StepFunctionUserState