package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.config.Configuration
import com.gu.emailservices.{EmailFields, EmailService}
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.monthlyContributions.state.SendThankYouEmailState
import com.gu.support.workers.model.{DirectDebitPaymentMethod, RequestInfo}
import com.gu.threadpools.CustomPool.executionContext
import com.gu.zuora.ZuoraService
import com.gu.zuora.encoding.CustomCodecs._
import com.typesafe.scalalogging.LazyLogging
import org.joda.time.DateTime

import scala.concurrent.Future

class SendThankYouEmail(thankYouEmailService: EmailService, servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[SendThankYouEmailState, Unit](servicesProvider) with LazyLogging {

  def this() = this(new EmailService(Configuration.emailServicesConfig.thankYou, executionContext))

  override protected def servicesHandler(
    state: SendThankYouEmailState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {
    logger.info(s"Number of available processors: ${Runtime.getRuntime.availableProcessors()}")
    fetchDirectDebitMandateId(state, services.zuoraService)
      .map(id => sendEmail(state, id))
      .map(_ => HandlerResult(Unit, requestInfo))
  }

  def fetchDirectDebitMandateId(state: SendThankYouEmailState, zuoraService: ZuoraService): Future[Option[String]] = state.paymentMethod match {
    case _: DirectDebitPaymentMethod =>
      zuoraService.getMandateIdFromAccountNumber(state.accountNumber)
    case _ => Future.successful(None)
  }
  def sendEmail(state: SendThankYouEmailState, directDebitMandateId: Option[String] = None): Future[SendMessageResult] =
    thankYouEmailService.send(EmailFields(
      email = state.user.primaryEmailAddress,
      created = DateTime.now(),
      amount = state.contribution.amount,
      currency = state.contribution.currency.iso,
      edition = state.user.country.alpha2,
      name = state.user.firstName,
      product = "monthly-contribution",
      paymentMethod = Some(state.paymentMethod),
      directDebitMandateId = directDebitMandateId
    ))
}
