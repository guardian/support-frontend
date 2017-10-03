package com.gu.support.workers.model.monthlyContributions.state

import java.util.UUID

import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.support.workers.model.monthlyContributions.Contribution
import com.gu.support.workers.model.{PaymentMethod, User}
import ophan.thrift.event.AbTest

case class CreateSalesforceContactState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  ophanIds: OphanIds,
  referrerAcquisitionData: ReferrerAcquisitionData,
  supportAbTests: Set[AbTest]
) extends StepFunctionUserState