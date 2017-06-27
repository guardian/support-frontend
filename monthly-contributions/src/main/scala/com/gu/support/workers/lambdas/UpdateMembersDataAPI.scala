package com.gu.support.workers.lambdas

import com.gu.support.workers.model.monthlyContributions.state.UpdateMembersDataAPIState
import com.typesafe.scalalogging.LazyLogging
import com.amazonaws.services.lambda.runtime.Context
import com.gu.services.{ServiceProvider, Services}

import scala.concurrent.ExecutionContext.Implicits.global
import com.gu.support.workers.encoding.StateCodecs._

import scala.concurrent.Future
import scala.concurrent.duration.Duration

class UpdateMembersDataAPI(servicesProvider: ServiceProvider = ServiceProvider, d: Option[Duration] = None)
    extends ServicesHandler[UpdateMembersDataAPIState, Unit](servicesProvider, d) with LazyLogging {

  override protected def servicesHandler(state: UpdateMembersDataAPIState, context: Context, services: Services): Future[Unit] = {
    services.membersDataService.update(state.user.id, state.user.isTestUser).map(_ => Unit)
  }
}