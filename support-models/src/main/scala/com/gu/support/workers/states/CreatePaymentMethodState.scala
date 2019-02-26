package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{User, _}

case class CreatePaymentMethodState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentFields: PaymentFields,
  promoCode: Option[PromoCode],
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object CreatePaymentMethodState {
  implicit val codec: Codec[CreatePaymentMethodState] = deriveCodec
}

