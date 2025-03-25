package com.gu.support.workers.states

import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.support.acquisitions.AcquisitionData
import com.gu.support.encoding.Codec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.workers._
import org.joda.time.LocalDate

import java.util.UUID

case class CreateZuoraSubscriptionState(
    requestId: UUID,
    user: User,
    giftRecipient: Option[GiftRecipient],
    product: ProductType,
    paymentMethod: PaymentMethod,
    analyticsInfo: AnalyticsInfo,
    firstDeliveryDate: Option[LocalDate],
    appliedPromotion: Option[AppliedPromotion],
    csrUsername: Option[String],
    salesforceCaseId: Option[String],
    acquisitionData: Option[AcquisitionData],
    salesForceContacts: SalesforceContactRecords,
) extends FailureHandlerState

object CreateZuoraSubscriptionState {
  implicit val codec: Codec[CreateZuoraSubscriptionState] = deriveCodec[CreateZuoraSubscriptionState]
}
