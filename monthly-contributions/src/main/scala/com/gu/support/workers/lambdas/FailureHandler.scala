package com.gu.support.workers.lambdas

import cats.implicits._
import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.emailservices.{EmailFields, EmailService}
import com.gu.helpers.FutureExtensions._
import com.gu.support.workers.encoding.ErrorJson
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.monthlyContributions.Status
import com.gu.support.workers.model.monthlyContributions.state.{CompletedState, FailureHandlerState}
import com.gu.support.workers.model.{ExecutionError, RequestInfo}
import com.gu.zuora.model.response.{ZuoraError, ZuoraErrorResponse}
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import org.joda.time.DateTime

import scala.concurrent.ExecutionContext.Implicits.global

class FailureHandler(emailService: EmailService)
    extends FutureHandler[FailureHandlerState, CompletedState]
    with LazyLogging {
  def this() = this(new EmailService(Configuration.emailServicesConfig.failed))

  override protected def handlerFuture(
    state: FailureHandlerState,
    error: Option[ExecutionError],
    RequestInfo: RequestInfo,
    context: Context
  ): FutureHandlerResult = {
    logger.info(
      s"FAILED contribution_amount: ${state.contribution.amount}\n" +
        s"contribution_currency: ${state.contribution.currency.iso}\n" +
        s"test_user: ${state.user.isTestUser}\n" +
        s"error: $error"
    )
    sendEmail(state).whenFinished(handleError(state, error, RequestInfo))
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

  private def handleError(state: FailureHandlerState, error: Option[ExecutionError], requestInfo: RequestInfo) =
    error.flatMap(getZuoraError) match {
      case Some(ZuoraErrorResponse(_, List(ze @ ZuoraError("TRANSACTION_FAILED", _)))) => returnState(
        state,
        requestInfo.appendMessage(s"Zuora reported a payment failure: $ze"),
        "There was an error processing your payment. Please\u00a0try\u00a0again."
      )
      case _ => returnState(state, requestInfo.copy(failed = true))
    }

  private def returnState(
    state: FailureHandlerState,
    RequestInfo: RequestInfo,
    message: String = "There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later."
  ) =
    HandlerResult(
      CompletedState(
        requestId = state.requestId,
        user = state.user,
        contribution = state.contribution,
        status = Status.Failure,
        message = Some(message)
      ), RequestInfo
    )

  private def getZuoraError(executionError: ExecutionError): Option[ZuoraErrorResponse] = for {
    retryException <- decode[ErrorJson](executionError.Cause).toOption
    underlyingException <- retryException.cause
    zuoraError <- ZuoraErrorResponse.fromErrorJson(underlyingException)
  } yield zuoraError
}