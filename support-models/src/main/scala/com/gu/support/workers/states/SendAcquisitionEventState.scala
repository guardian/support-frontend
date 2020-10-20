package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromoCode
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.{User, _}
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import org.joda.time.LocalDate

trait SendAcquisitionEventState extends FailureHandlerState {
  def requestId: UUID
  def product: ProductType
  def paymentOrRedemptionData: Either[PaymentMethodWithSchedule, RedemptionData]
  def firstDeliveryDate: Option[LocalDate]
  def promoCode: Option[PromoCode]
  def acquisitionData: Option[AcquisitionData]
}

case class SendAcquisitionEventStateImpl(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  product: ProductType,
  analyticsInfo: AnalyticsInfo,
  paymentOrRedemptionData: Either[PaymentMethodWithSchedule, RedemptionData],
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  acquisitionData: Option[AcquisitionData]
) extends SendAcquisitionEventState

object SendAcquisitionEventState {
  implicit val decoder: Decoder[SendAcquisitionEventState] = deriveDecoder[SendAcquisitionEventStateImpl].map(identity)
}
