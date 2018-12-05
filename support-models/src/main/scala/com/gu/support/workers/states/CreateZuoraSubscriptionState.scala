package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User}
import com.gu.support.workers._

case class CreateZuoraSubscriptionState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentMethod: PaymentMethod,
  promoCode: Option[PromoCode],
  salesForceContact: SalesforceContactRecord,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState
