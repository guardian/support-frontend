package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.{AcquisitionData, PaymentMethod, SalesforceContactRecord, User}

case class SendThankYouEmailState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentMethod: PaymentMethod,
  salesForceContact: SalesforceContactRecord,
  accountNumber: String,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState

