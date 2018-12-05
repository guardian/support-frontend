package com.gu.support.workers.states

import com.gu.support.workers.{PaymentMethod, User}
import com.gu.support.workers._

case class SendAcquisitionEventState(
  user: User,
  product: ProductType,
  paymentMethod: PaymentMethod,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState
