package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.monthlyContributions.Status
import com.gu.support.workers.model.monthlyContributions.state.{CompletedState, SendThankYouEmailState}
import com.gu.support.workers.model.{ExecutionError, RequestInfo}
import com.typesafe.scalalogging.LazyLogging

class ContributionCompleted
    extends Handler[SendThankYouEmailState, CompletedState]
    with LazyLogging {

  override protected def handler(state: SendThankYouEmailState, error: Option[ExecutionError], RequestInfo: RequestInfo, context: Context) = {
    val fields = List(
      "contribution_amount" -> state.contribution.amount.toString,
      "contribution_currency" -> state.contribution.currency.iso.toString,
      "test_user" -> state.user.isTestUser.toString,
      "payment_method" -> state.paymentMethod.`type`
    )

    logger.info(fields.map({ case (k, v) => s"$k: $v" }).mkString("SUCCESS ", " ", ""))

    handlerResult(CompletedState(
      requestId = state.requestId,
      user = state.user,
      contribution = state.contribution,
      status = Status.Success,
      message = None
    ), RequestInfo)
  }
}
