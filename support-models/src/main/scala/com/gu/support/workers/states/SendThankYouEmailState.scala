package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import com.gu.support.promotions.PromoCode
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import org.joda.time.LocalDate

case class SendThankYouEmailState(
  requestId: UUID,
  user: User,
  giftPurchase: Option[GiftPurchase],
  product: ProductType,
  analyticsInfo: AnalyticsInfo,
  paymentOrRedemptionData: Either[PaymentMethodWithSchedule, RedemptionData],
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  salesForceContact: SalesforceContactRecord,
  accountNumber: String,
  subscriptionNumber: String,
  acquisitionData: Option[AcquisitionData]
) extends SendAcquisitionEventState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SendThankYouEmailState {
  import com.gu.support.encoding.CustomCodecs._
  implicit val codec: Codec[SendThankYouEmailState] = deriveCodec
}

case class PaymentMethodWithSchedule(paymentMethod: PaymentMethod, paymentSchedule: PaymentSchedule)
object PaymentMethodWithSchedule {
  implicit val codec: Codec[PaymentMethodWithSchedule] = deriveCodec
}
