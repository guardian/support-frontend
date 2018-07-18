package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.config.Configuration
import com.gu.emailservices.{ContributionEmailFields, EmailService}
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.states.SendThankYouEmailState
import com.gu.support.workers.model.{DirectDebitPaymentMethod, RequestInfo}
import com.gu.threadpools.CustomPool.executionContext
import com.gu.zuora.ZuoraService
import com.gu.zuora.encoding.CustomCodecs._
import org.joda.time.DateTime

import scala.concurrent.Future

class SendThankYouEmail(thankYouEmailService: EmailService, servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[SendThankYouEmailState, SendMessageResult](servicesProvider) {

  def this() = this(new EmailService(Configuration.contributionEmailServicesConfig.thankYou, executionContext))

  override protected def servicesHandler(
    state: SendThankYouEmailState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {
    SafeLogger.info(s"Number of available processors: ${Runtime.getRuntime.availableProcessors()}")
    for {
      mandateId <- fetchDirectDebitMandateId(state, services.zuoraService)
      emailResult <- sendEmail(state, mandateId)
    } yield HandlerResult(emailResult, requestInfo)
  }

  def fetchDirectDebitMandateId(state: SendThankYouEmailState, zuoraService: ZuoraService): Future[Option[String]] = state.paymentMethod match {
    case _: DirectDebitPaymentMethod =>
      zuoraService.getMandateIdFromAccountNumber(state.accountNumber)
    case _ => Future.successful(None)
  }
  def sendEmail(state: SendThankYouEmailState, directDebitMandateId: Option[String] = None): Future[SendMessageResult] =
    thankYouEmailService.send(ContributionEmailFields(
      email = state.user.primaryEmailAddress,
      created = DateTime.now(),
      amount = 0, //TODO It's not actually used by the email, maybe remove it?
      currency = state.product.currency,
      edition = state.user.country.alpha2,
      name = state.user.firstName,
      product = "monthly-contribution", //TODO send the right email for digital pack
      paymentMethod = Some(state.paymentMethod),
      directDebitMandateId = directDebitMandateId
    ))
}
