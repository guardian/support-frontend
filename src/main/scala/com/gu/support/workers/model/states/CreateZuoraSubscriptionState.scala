package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.{AcquisitionData, PaymentMethod, SalesforceContactRecord, User}

case class CreateZuoraSubscriptionState(
  requestId: UUID,
  user: User,
  product: Product,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState
