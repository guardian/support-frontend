package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{User, _}
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import com.gu.support.workers.redemption.RedemptionData

case class CreatePaymentMethodState(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  redemptionData: Option[RedemptionData],
  product: ProductType,
  paymentFields: PaymentDetails[PaymentFields],
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object CreatePaymentMethodState {
  implicit val codec: Codec[CreatePaymentMethodState] = deriveCodec
}

