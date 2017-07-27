package com.gu.support.workers.model.monthlyContributions.state

import java.util.UUID

import com.gu.support.workers.model._
import com.gu.support.workers.model.monthlyContributions.{Contribution, Status}

case class CompletedState(
  requestId: UUID,
  user: User,
  contribution: Contribution,
  status: Status,
  message: Option[String]
) extends StepFunctionUserState

