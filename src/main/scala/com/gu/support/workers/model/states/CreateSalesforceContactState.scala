package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model._

case class CreateSalesforceContactState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentMethod: PaymentMethod,
  acquisitionData: Option[AcquisitionData],
  readAccess: ReadAccess
) extends StepFunctionUserState