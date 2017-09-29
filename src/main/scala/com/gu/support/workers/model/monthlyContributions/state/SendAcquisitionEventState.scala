package com.gu.support.workers.model.monthlyContributions.state

import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.support.workers.model.{PaymentMethod, User}
import com.gu.support.workers.model.monthlyContributions.Contribution

case class SendAcquisitionEventState(
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  ophanIds: OphanIds,
  referrerAcquisitionData: ReferrerAcquisitionData
) extends StepFunctionUserState
