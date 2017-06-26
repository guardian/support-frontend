package com.gu.support.workers.model.monthlyContributions.state

import java.util.UUID

import com.gu.support.workers.model.User

case class UpdateMembersDataAPIState(
 requestId: UUID,
 user: User
) extends StepFunctionUserState

