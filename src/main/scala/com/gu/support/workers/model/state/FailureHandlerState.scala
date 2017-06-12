package com.gu.support.workers.model.state

import java.util.UUID

import com.gu.support.workers.model._

case class FailureHandlerState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  error: ErrorState
) extends StepFunctionUserState

