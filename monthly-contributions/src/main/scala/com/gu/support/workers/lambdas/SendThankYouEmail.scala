package com.gu.support.workers.lambdas

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import org.joda.time.DateTime
import com.amazonaws.services.lambda.runtime.Context
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._
import com.gu.config.Configuration
import com.gu.emailservices.{ ThankYouEmailService, ThankYouFields }
import com.gu.support.workers.model.SendThankYouEmailState

class SendThankYouEmail(
    thankYouEmailService: ThankYouEmailService = new ThankYouEmailService(Configuration.emailServicesConfig.thankYouEmailQueue)
) extends FutureHandler[SendThankYouEmailState, Unit] with LazyLogging {

  override protected def handlerFuture(state: SendThankYouEmailState, context: Context): Future[Unit] = {
    logger.info(s"state: $state")
    sendEmail(state)
  }

  def sendEmail(state: SendThankYouEmailState): Future[Unit] = {
    thankYouEmailService.send(ThankYouFields(
      email = state.user.primaryEmailAddress,
      created = DateTime.now(),
      amount = state.amount,
      currency = "GBP",
      edition = "UK",
      name = state.user.firstName
    )).map(_ => Unit)
  }
}
