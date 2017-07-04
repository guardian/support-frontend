package com.gu.support.workers.lambdas

import com.gu.support.workers.model.monthlyContributions.state.UpdateMembersDataAPIState
import com.typesafe.scalalogging.LazyLogging
import com.amazonaws.services.lambda.runtime.Context
import com.gu.services.{ServiceProvider, Services}
import com.gu.monitoring.MembersDataAPIMetrics

import scala.concurrent.ExecutionContext.Implicits.global
import com.gu.support.workers.encoding.StateCodecs._

import scala.concurrent.Future

class UpdateMembersDataAPI(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[UpdateMembersDataAPIState, Unit](servicesProvider) with LazyLogging {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(state: UpdateMembersDataAPIState, context: Context, services: Services): Future[Unit] = {
    services.membersDataService.update(state.user.id, state.user.isTestUser).map(_ => Unit)
  }

  def putCloudWatchMetrics(paymentMethod: String): Unit =
    new MembersDataAPIMetrics("recurring-contribution")
      .putMembersDataAPIUpdated()
}