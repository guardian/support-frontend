package com.gu.support.workers.lambdas

import cats.implicits._
import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.emailservices.{EmailFields, EmailService}
import com.gu.helpers.FutureExtensions._
import com.gu.monitoring.products.{FailureMetrics, RecurringContributionsMetrics}
import com.gu.support.workers.encoding.ErrorJson
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.ExecutionError
import com.gu.support.workers.model.monthlyContributions.Status
import com.gu.support.workers.model.monthlyContributions.state.{CompletedState, FailureHandlerState}
import com.gu.zuora.model.response.ZuoraErrorResponse
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
      s"FAILED contribution_amount: ${state.contribution.amount} contribution_currency: ${state.contribution.currency.iso} test_user: ${state.user.isTestUser}"
    )
    putFailureHandlerTriggered()
    emailService.send(EmailFields(
      email = state.user.primaryEmailAddress,
      created = DateTime.now(),
      amount = state.contribution.amount,
      currency = state.contribution.currency.iso,
      edition = state.user.country.alpha2,
      name = state.user.firstName,
      product = "monthly-contribution"
    )).whenFinished {
      logger.info(s"Error=$error")
      CompletedState(
        requestId = state.requestId,
        user = state.user,
        contribution = state.contribution,
        status = Status.Failure,
        message = Some(error.flatMap(messageFromExecutionError).getOrElse(defaultErrorMessage))
      )
    }
  }

  private val defaultErrorMessage =
    "There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later."

  private def messageFromExecutionError(error: ExecutionError): Option[String] = {
    val maybeZuoraError = for {
      retryException <- decode[ErrorJson](error.Cause).toOption
      underlyingException <- retryException.cause
      zuoraError <- ZuoraErrorResponse.fromErrorJson(underlyingException)
    } yield zuoraError

    maybeZuoraError.collect {
      case e if e.errors.exists(_.Code == "TRANSACTION_FAILED") =>
        "There was an error processing your payment. Please\u00a0try\u00a0again."
    }
  }

  def putFailureHandlerTriggered(): Future[Unit] = {
    new FailureMetrics("monthly")
      .putFailureHandlerTriggered().recover({ case _ => () })
  }

}
