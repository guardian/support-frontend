package com.gu.support.workers.states

import com.gu.support.acquisitions.AcquisitionData

import java.util.UUID
import com.gu.support.workers.{PaymentMethod, User, _}
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}

case class CreateSalesforceContactState(
    requestId: UUID,
    user: User,
    giftRecipient: Option[GiftRecipient],
    product: ProductType,
    analyticsInfo: AnalyticsInfo,
    paymentMethod: PaymentMethod,
    firstDeliveryDate: Option[LocalDate],
    appliedPromotion: Option[AppliedPromotion],
    csrUsername: Option[String],
    salesforceCaseId: Option[String],
    acquisitionData: Option[AcquisitionData],
    similarProductsConsent: Boolean,
) extends FailureHandlerState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object CreateSalesforceContactState {
  import com.gu.support.encoding.CustomCodecs.decodeEither
  import com.gu.support.encoding.CustomCodecs.encodeEither
  implicit val codec: Codec[CreateSalesforceContactState] = deriveCodec
}
