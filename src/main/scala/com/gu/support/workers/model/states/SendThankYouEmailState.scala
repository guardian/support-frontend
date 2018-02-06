package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model._

case class SendThankYouEmailState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord,
  accountNumber: String,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState

