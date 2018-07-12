package com.gu.support.workers.model.states

import com.gu.support.workers.model._

case class SendAcquisitionEventState(
  user: User,
  product: ProductType,
  paymentMethod: PaymentMethod,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState
