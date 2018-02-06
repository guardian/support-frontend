package com.gu.support.workers.model.monthlyContributions.state

import com.gu.support.workers.model.states.StepFunctionUserState
import com.gu.support.workers.model.{AcquisitionData, Contribution, PaymentMethod, User}

case class SendAcquisitionEventState(
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState
