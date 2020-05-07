package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.promotions.PromoCode
import com.gu.support.workers.redemption.RedemptionData
import com.gu.support.workers.{User, _}
import org.joda.time.LocalDate

case class FailureHandlerState(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  redemptionData: Option[RedemptionData],
  product: ProductType,
  paymentFields: PaymentDetails[PaymentFields], //Will be present if CreatePaymentMethod failed
  paymentMethod: PaymentDetails[PaymentMethod], //Will be present if anything after CreatePaymentMethod failed
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode]
) extends StepFunctionUserState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}

object FailureHandlerState {
  implicit val codec: Codec[FailureHandlerState] = deriveCodec
}

