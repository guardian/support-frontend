package com.gu.support.workers.states

import com.gu.support.workers.{PaymentMethod, User, _}

case class SendAcquisitionEventState(
  user: User,
  product: ProductType,
  paymentMethod: PaymentMethod,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SendAcquisitionEventState {
  implicit val codec: Codec[SendAcquisitionEventState] = deriveCodec
}
