package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.redemption.RedemptionData
import com.gu.support.workers.{PaymentMethod, User, _}
import org.joda.time.LocalDate

case class SendAcquisitionEventState(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  redemptionData: Option[RedemptionData],
  product: ProductType,
  paymentMethod: PaymentDetails[PaymentMethod],
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SendAcquisitionEventState {
  implicit val codec: Codec[SendAcquisitionEventState] = deriveCodec
}
