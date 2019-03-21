package com.gu.support.workers.states

import com.gu.support.workers.{User, _}

case class SendAcquisitionEventState(
  user: User,
  product: ProductType,
  paymentMethodDisplayFields: PaymentMethodDisplayFields,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SendAcquisitionEventState {
  implicit val codec: Codec[SendAcquisitionEventState] = deriveCodec
}
