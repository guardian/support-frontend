package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.workers.User
import com.gu.support.workers._

case class FailureHandlerState(
  requestId: UUID,
  user: User,
  product: ProductType
) extends StepFunctionUserState

