package com.gu.support.workers.states

import com.gu.support.acquisitions.AcquisitionData

import java.util.UUID
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{PaymentMethod, User, _}
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import com.gu.support.redemptions.RedemptionData

case class CreateSalesforceContactState(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  product: ProductType,
  analyticsInfo: AnalyticsInfo,
  paymentMethod: Either[PaymentMethod, RedemptionData],
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  acquisitionData: Option[AcquisitionData]
) extends FailureHandlerState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object CreateSalesforceContactState {
  import com.gu.support.encoding.CustomCodecs.decodeEither
  import com.gu.support.encoding.CustomCodecs.encodeEither
  implicit val codec: Codec[CreateSalesforceContactState] = deriveCodec
}
