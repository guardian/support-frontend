package com.gu.support.workers.states

import com.gu.support.acquisitions.AcquisitionData

import java.util.UUID
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.{User, _}

case class PreparePaymentMethodForReuseState(
    requestId: UUID,
    product: ProductType,
    analyticsInfo: AnalyticsInfo,
    paymentFields: ExistingPaymentFields,
    user: User,
    giftRecipient: Option[GiftRecipient],
    acquisitionData: Option[AcquisitionData],
) extends MinimalFailureHandlerState

import com.gu.support.encoding.Codec

object PreparePaymentMethodForReuseState {
  implicit val codec: Codec[PreparePaymentMethodForReuseState] = deriveCodec
}
