package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.emailservices.{EmailFields, EmailService}
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.monthlyContributions.state.FailureHandlerState
import com.typesafe.scalalogging.LazyLogging
import org.joda.time.DateTime

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class FailureHandler(emailService: EmailService)
    extends FutureHandler[FailureHandlerState, Unit]
    with LazyLogging {
  def this() = this(new EmailService(Configuration.emailServicesConfig.failed))

  override protected def handlerFuture(state: FailureHandlerState, context: Context): Future[Unit] = {
    sendEmail(state)
  }

  def sendEmail(state: FailureHandlerState): Future[Unit] = {
    emailService.send(EmailFields(
      email = state.user.primaryEmailAddress,
      created = DateTime.now(),
      amount = state.contribution.amount,
      currency = state.contribution.currency.iso,
      edition = state.user.country.alpha2,
      name = state.user.firstName
    )).map(_ => Unit)
  }
}
