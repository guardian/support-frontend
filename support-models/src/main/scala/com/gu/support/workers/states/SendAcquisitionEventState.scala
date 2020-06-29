package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromoCode
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.{PaymentMethod, User, _}
import io.circe.Decoder
import org.joda.time.LocalDate

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

trait SendAcquisitionEventState extends FailureHandlerState {
  def requestId: UUID
  def giftRecipient: Option[GiftRecipient]
  def product: ProductType
  def paymentMethod: Either[PaymentMethod, RedemptionData]
  def firstDeliveryDate: Option[LocalDate]
  def promoCode: Option[PromoCode]
  def acquisitionData: Option[AcquisitionData]
}

case class SendAcquisitionEventStateImpl(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  product: ProductType,
  paymentProvider: PaymentProvider,
  paymentMethod: Either[PaymentMethod, RedemptionData],
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  acquisitionData: Option[AcquisitionData]
) extends SendAcquisitionEventState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SendAcquisitionEventState {
  implicit val decoder: Decoder[SendAcquisitionEventState] = deriveDecoder[SendAcquisitionEventStateImpl].map(identity)
}
