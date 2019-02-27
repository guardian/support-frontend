package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}

case class CreateZuoraSubscriptionState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentMethod: PaymentMethod,
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  salesForceContact: SalesforceContactRecord,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object CreateZuoraSubscriptionState {
  implicit val codec: Codec[CreateZuoraSubscriptionState] = deriveCodec
}
