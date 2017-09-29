package com.gu.support.workers.model.monthlyContributions.state

import java.util.UUID

import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.{PaymentMethod, User}

case class CreateSalesforceContactState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  ophanIds: OphanIds,
  referrerAcquisitionData: ReferrerAcquisitionData
) extends StepFunctionUserState