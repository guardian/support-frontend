package com.gu.support.workers.model.monthlyContributions.state

import java.util.UUID

import com.gu.support.workers.model._
import com.gu.support.workers.model.monthlyContributions.Contribution

case class FailureHandlerState(
  requestId: UUID,
  user: User,
  contribution: Contribution
) extends StepFunctionUserState

