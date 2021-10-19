package com.gu.support.workers.states

import com.gu.support.acquisitions.AcquisitionData

import java.util.UUID
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{User, _}
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import com.gu.support.redemptions.RedemptionData

case class CreatePaymentMethodState(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  product: ProductType,
  analyticsInfo: AnalyticsInfo,
  paymentFields: Either[PaymentFields, RedemptionData],
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  csrUsername: Option[String],
  acquisitionData: Option[AcquisitionData],
  ipAddress: String,
  userAgent: String
) extends FailureHandlerState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object CreatePaymentMethodState {
  import com.gu.support.encoding.CustomCodecs.decodeEither
  import com.gu.support.encoding.CustomCodecs.encodeEither
  implicit val codec: Codec[CreatePaymentMethodState] = deriveCodec
}

