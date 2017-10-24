package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.monitoring.products.RecurringContributionsMetrics
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.ExecutionError
import com.gu.support.workers.model.monthlyContributions.state.{CompletedState, SendThankYouEmailState}
import com.gu.support.workers.model.monthlyContributions.Status
import com.typesafe.scalalogging.LazyLogging
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ContributionCompleted
    extends Handler[SendThankYouEmailState, CompletedState]
    with LazyLogging {

  override protected def handler(state: SendThankYouEmailState, error: Option[ExecutionError], context: Context): CompletedState = {

    val fields = List(
      "contribution_amount" -> state.contribution.amount.toString,
      "contribution_currency" -> state.contribution.currency.iso.toString,
      "test_user" -> state.user.isTestUser.toString,
      "payment_method" -> state.paymentMethod.`type`
    )

    logger.info(fields.map({ case (k, v) => s"$k: $v" }).mkString("SUCCESS ", " ", ""))
    putContributionCompleted(state.paymentMethod.`type`)

    CompletedState(
      requestId = state.requestId,
      user = state.user,
      contribution = state.contribution,
      status = Status.Success,
      message = None
    )
  }

  def putContributionCompleted(paymentMethod: String): Future[Unit] =
    new RecurringContributionsMetrics(paymentMethod.toLowerCase, "monthly")
      .putContributionCompleted().recover({ case _ => () })

}
