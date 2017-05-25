package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.emailservices.{ThankYouEmailService, ThankYouFields}
import com.gu.support.workers.model.state.SendThankYouEmailState
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._
import org.joda.time.DateTime

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class SendThankYouEmail(thankYouEmailService: ThankYouEmailService)
    extends FutureHandler[SendThankYouEmailState, Unit]
    with LazyLogging {
  def this() = this(new ThankYouEmailService(Configuration.emailServicesConfig.thankYouEmailQueue))

  override protected def handlerFuture(state: SendThankYouEmailState, context: Context): Future[Unit] = {
    sendEmail(state)
  }

  def sendEmail(state: SendThankYouEmailState): Future[Unit] = {
    thankYouEmailService.send(ThankYouFields(
      email = state.user.primaryEmailAddress,
      created = DateTime.now(),
      amount = state.contribution.amount,
      currency = state.contribution.currency.iso,
      edition = state.user.country.alpha2,
      name = state.user.firstName
    )).map(_ => Unit)
  }
}
