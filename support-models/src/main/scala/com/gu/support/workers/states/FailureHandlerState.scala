package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.workers.{User, _}

case class FailureHandlerState(
  requestId: UUID,
  user: User,
  product: ProductType
) extends StepFunctionUserState

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object FailureHandlerState {
  implicit val codec: Codec[FailureHandlerState] = deriveCodec
}

