package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User}
import com.gu.support.workers._

case class SendThankYouEmailState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord,
  accountNumber: String,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState

