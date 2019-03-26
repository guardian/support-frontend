package com.gu.support.workers.states

import java.util.UUID
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.workers.{User, _}

case class ClonePaymentMethodState(
    requestId: UUID,
    product: ProductType,
    paymentFields: ExistingPaymentFields,
    user: User,
    acquisitionData: Option[AcquisitionData]
  ) extends StepFunctionUserState

import com.gu.support.encoding.Codec

object ClonePaymentMethodState {
  implicit val codec: Codec[ClonePaymentMethodState] = deriveCodec
}
