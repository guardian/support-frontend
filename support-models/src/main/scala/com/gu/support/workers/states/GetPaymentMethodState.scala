package com.gu.support.workers.states

import java.util.UUID
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.workers.{User, _}

case class GetPaymentMethodState(
    requestId: UUID,
    product: ProductType,
    paymentFields: ExistingPaymentFields,
    user: User,
    acquisitionData: Option[AcquisitionData]
  ) extends StepFunctionUserState

import com.gu.support.encoding.Codec

object GetPaymentMethodState {
  implicit val codec: Codec[GetPaymentMethodState] = deriveCodec
}
