package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.workers.redemption.RedemptionData
import com.gu.support.workers.{User, _}

case class PreparePaymentMethodForReuseState(
    requestId: UUID,
    product: ProductType,
    paymentFields: ExistingPaymentFields,
    user: User,
    giftRecipient: Option[GiftRecipient],
    redemptionData: Option[RedemptionData],
    acquisitionData: Option[AcquisitionData]
  ) extends StepFunctionUserState

import com.gu.support.encoding.Codec

object PreparePaymentMethodForReuseState {
  implicit val codec: Codec[PreparePaymentMethodForReuseState] = deriveCodec
}
