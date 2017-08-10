package com.gu.support.workers.model.states

import java.util.UUID

import com.gu.support.workers.model._

case class FailureHandlerState(
  requestId: UUID,
  user: User,
  product: Product
) extends StepFunctionUserState

