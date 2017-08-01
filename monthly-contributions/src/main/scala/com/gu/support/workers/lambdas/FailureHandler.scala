package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.emailservices.{EmailFields, EmailService}
import com.gu.helpers.FutureExtensions._
import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.ExecutionError
import com.gu.support.workers.model.monthlyContributions.state.{CompletedState, FailureHandlerState}
import com.gu.support.workers.model.monthlyContributions.Status
import com.typesafe.scalalogging.LazyLogging
import org.joda.time.DateTime

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import com.gu.support.workers.encoding.Helpers.deriveCodec
import io.circe.parser._

case class ErrorJson(errorMessage: String, errorType: String, stackTrace: String, cause: Option[ErrorJson])

object ErrorJson {
  implicit val codec: Codec[ErrorJson] = deriveCodec
}

class FailureHandler(emailService: EmailService)
    extends FutureHandler[FailureHandlerState, CompletedState]
    with LazyLogging {
  def this() = this(new EmailService(Configuration.emailServicesConfig.failed))

  override protected def handlerFuture(state: FailureHandlerState, error: Option[ExecutionError], context: Context): Future[CompletedState] = {
    emailService.send(EmailFields(
      email = state.user.primaryEmailAddress,
      created = DateTime.now(),
      amount = state.contribution.amount,
      currency = state.contribution.currency.iso,
      edition = state.user.country.alpha2,
      name = state.user.firstName
    )).whenFinished {
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
    "An error occurred while processing your contribution. Please try again later."

  private def messageFromExecutionError(error: ExecutionError): Option[String] = {
    decode[ErrorJson](error.Cause).right.toOption.collect {
      case cause if cause.errorMessage.contains("TRANSACTION_FAILED") =>
        "Your payment failed. Please try again or use another payment method."
    }
  }
}
