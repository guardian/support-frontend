package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.model.states.ZuoraResultsFetcherEndState

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class WriteToDatabaseLambda extends Handler[ZuoraResultsFetcherEndState, Unit] {

  override protected def handlerFuture(input: ZuoraResultsFetcherEndState, context: Context) = {
    Future.successful(())
  }

}
