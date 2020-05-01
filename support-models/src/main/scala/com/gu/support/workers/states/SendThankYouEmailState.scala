package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import org.joda.time.LocalDate

case class SendThankYouEmailState(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  redemptionData: Option[RedemptionData],
  product: ProductType,
  paymentMethod: Option[PaymentMethod],
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  salesForceContact: SalesforceContactRecord,
  accountNumber: String,
  subscriptionNumber: String,
  paymentSchedule: PaymentSchedule,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SendThankYouEmailState {
  implicit val codec: Codec[SendThankYouEmailState] = deriveCodec
}

