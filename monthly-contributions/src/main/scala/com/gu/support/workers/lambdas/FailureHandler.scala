package com.gu.support.workers.lambdas

import cats.implicits._
import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.emailservices.{EmailFields, EmailService}
import com.gu.helpers.FutureExtensions._
import com.gu.support.workers.encoding.ErrorJson
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.ExecutionError
import com.gu.support.workers.model.monthlyContributions.Status
import com.gu.support.workers.model.monthlyContributions.state.{CompletedState, FailureHandlerState}
import com.gu.zuora.model.response.{ZuoraError, ZuoraErrorResponse}
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import org.joda.time.DateTime

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class FailureHandler(emailService: EmailService)
    extends FutureHandler[FailureHandlerState, CompletedState]
    with LazyLogging {
  def this() = this(new EmailService(Configuration.emailServicesConfig.failed))

  override protected def handlerFuture(state: FailureHandlerState, error: Option[ExecutionError], context: Context): Future[CompletedState] = {
    logger.info(
      s"FAILED contribution_amount: ${state.contribution.amount}\n" +
        s"contribution_currency: ${state.contribution.currency.iso}\n" +
        s"test_user: ${state.user.isTestUser}\n" +
        s"error: $error"
    )
    sendEmail(state).whenFinished(handleError(state, error))
  }

  private def sendEmail(state: FailureHandlerState) = emailService.send(EmailFields(
    email = state.user.primaryEmailAddress,
    created = DateTime.now(),
    amount = state.contribution.amount,
    currency = state.contribution.currency.iso,
    edition = state.user.country.alpha2,
    name = state.user.firstName,
    product = "monthly-contribution"
  ))

  private def handleError(state: FailureHandlerState, error: Option[ExecutionError]) =
    error.flatMap(getZuoraError) match {
      case Some(ZuoraErrorResponse(_, List(ZuoraError("TRANSACTION_FAILED", _)))) => returnState(
        state,
        Status.Failure,
        "There was an error processing your payment. Please\u00a0try\u00a0again."
      )
      case _ => returnState(state)
    }

  private def returnState(
    state: FailureHandlerState,
    status: Status = Status.Exception,
    message: String = "There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later."
  ) =
    CompletedState(
      requestId = state.requestId,
      user = state.user,
      contribution = state.contribution,
      status = status,
      message = Some(message)
    )

  private def getZuoraError(executionError: ExecutionError): Option[ZuoraErrorResponse] = for {
    retryException <- decode[ErrorJson](executionError.Cause).toOption
    underlyingException <- retryException.cause
    zuoraError <- ZuoraErrorResponse.fromErrorJson(underlyingException)
  } yield zuoraError
}