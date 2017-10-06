package com.gu.support.workers.model.monthlyContributions.state

import com.gu.support.workers.model.{NonPaymentAcquisitionData, PaymentMethod, User}
import com.gu.support.workers.model.monthlyContributions.Contribution

case class SendAcquisitionEventState(
  user: User,
  contribution: Contribution,
  paymentMethod: PaymentMethod,
  nonPaymentAcquisitionData: Option[NonPaymentAcquisitionData]
) extends StepFunctionUserState
