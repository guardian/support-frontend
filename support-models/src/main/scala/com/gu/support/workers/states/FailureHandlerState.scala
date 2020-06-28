package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.promotions.PromoCode
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.{User, _}
import io.circe.Decoder
import org.joda.time.LocalDate
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class FailureHandlerStateImpl(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  product: ProductType,
  paymentProvider: PaymentProvider,
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode]
) extends FailureHandlerState

trait FailureHandlerState extends MinimalFailureHandlerState {
  def firstDeliveryDate: Option[LocalDate]
  def promoCode: Option[PromoCode]
}

trait MinimalFailureHandlerState extends StepFunctionUserState {
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
  implicit val decoder: Decoder[FailureHandlerState] = deriveDecoder[FailureHandlerStateImpl].map(identity)
}

