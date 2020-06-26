package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.promotions.PromoCode
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.{User, _}
import org.joda.time.LocalDate

case class FailureHandlerState(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  product: ProductType,
  paymentProvider: PaymentProvider,
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode]
) extends FailableState

trait FailableState extends StepFunctionUserState {
  // only required fields needed here
  def requestId: UUID
  def user: User
  def giftRecipient: Option[GiftRecipient]
  def product: ProductType
  def paymentProvider: PaymentProvider
}

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}

object FailureHandlerState {
  import com.gu.support.encoding.CustomCodecs._
  implicit val codec: Codec[FailureHandlerState] = deriveCodec
}

