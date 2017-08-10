package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model.{Status, _}

case class CompletedState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  status: Status,
  message: Option[String]
) extends StepFunctionUserState

