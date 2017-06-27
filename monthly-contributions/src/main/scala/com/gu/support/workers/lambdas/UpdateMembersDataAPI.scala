package com.gu.support.workers.lambdas

import com.gu.support.workers.model.monthlyContributions.state.UpdateMembersDataAPIState
import com.typesafe.scalalogging.LazyLogging
import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.emailservices.EmailService
import com.gu.membersDataAPI.MembersDataService

import scala.concurrent.ExecutionContext.Implicits.global
import com.gu.support.workers.encoding.StateCodecs._

import scala.concurrent.Future

class UpdateMembersDataAPI(membersDataService: MembersDataService)
    extends FutureHandler[UpdateMembersDataAPIState, Unit] with LazyLogging {

  def this() = this(new MembersDataService(Configuration.membersDataApiConfig))

  override protected def handlerFuture(state: UpdateMembersDataAPIState, context: Context): Future[Unit] = {
    update(state)
  }

  def update(state: UpdateMembersDataAPIState): Future[Unit] = {
    membersDataService.update(state.user.id).map(_ => Unit)
  }
}