package com.gu.support.workers.states

import java.util.UUID

import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import com.gu.support.redemptions.RedemptionData

case class CreateZuoraSubscriptionState(
  requestId: UUID,
  user: User,
  giftRecipient: Option[GiftRecipient],
  product: ProductType,
  paymentProvider: PaymentProvider,
  paymentMethod: Either[PaymentMethod, RedemptionData],
  firstDeliveryDate: Option[LocalDate],
  promoCode: Option[PromoCode],
  salesforceContacts: SalesforceContactRecords,
  acquisitionData: Option[AcquisitionData]
) extends FailureHandlerState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object CreateZuoraSubscriptionState {
  import com.gu.support.encoding.CustomCodecs._
  implicit val codec: Codec[CreateZuoraSubscriptionState] = deriveCodec
}
