package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.ExecutionError
import com.gu.support.workers.model.monthlyContributions.state.{CompletedState, SendThankYouEmailState}
import com.gu.support.workers.model.monthlyContributions.Status
import com.typesafe.scalalogging.LazyLogging

class ContributionCompleted
    extends Handler[SendThankYouEmailState, CompletedState]
    with LazyLogging {

  override protected def handler(state: SendThankYouEmailState, error: Option[ExecutionError], context: Context): CompletedState = {
    CompletedState(
      requestId = state.requestId,
      user = state.user,
      contribution = state.contribution,
      status = Status.Success,
      message = None
    )
  }
}
