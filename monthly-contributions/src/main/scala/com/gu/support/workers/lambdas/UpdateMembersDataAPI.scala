package com.gu.support.workers.lambdas

import com.gu.support.workers.model.monthlyContributions.state.SendThankYouEmailState
import com.typesafe.scalalogging.LazyLogging
import com.amazonaws.services.lambda.runtime.Context
import com.gu.membersDataAPI.MembersDataService
import scala.concurrent.ExecutionContext.Implicits.global
import com.gu.support.workers.encoding.StateCodecs._

import scala.concurrent.Future

class UpdateMembersDataAPI(membersDataService: MembersDataService)
  extends FutureHandler[SendThankYouEmailState, Unit] with LazyLogging {
  override protected def handlerFuture(state: SendThankYouEmailState, context: Context): Future[Unit] = {
    update(state)
  }

  def update(state: SendThankYouEmailState): Future[Unit] = {
    membersDataService.update(state.user.id).map(_ => Unit)
  }
}