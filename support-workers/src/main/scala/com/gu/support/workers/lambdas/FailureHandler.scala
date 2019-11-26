package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.emailservices._
import com.gu.helpers.FutureExtensions._
import com.gu.monitoring.{Error, IgnoredError, LambdaExecutionResult, LambdaExecutionStatus, PaymentFailure, SafeLogger}
import com.gu.stripe.StripeError
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.encoding.ErrorJson
import com.gu.support.workers.CheckoutFailureReasons._
import com.gu.support.workers._
import com.gu.support.workers.lambdas.FailureHandler.{extractUnderlyingError, toCheckoutFailureReason}
import com.gu.support.workers.states.{CheckoutFailureState, FailureHandlerState}
import com.gu.support.zuora.api.response.{ZuoraError, ZuoraErrorResponse}
import io.circe.Decoder
import io.circe.generic.auto._
import io.circe.parser.decode

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class FailureHandler(emailService: EmailService) extends Handler[FailureHandlerState, CheckoutFailureState] {

  def this() = this(new EmailService)

  override protected def handlerFuture(
    state: FailureHandlerState,
    error: Option[ExecutionError],
    requestInfo: RequestInfo,
    context: Context
  ): FutureHandlerResult = {
    SafeLogger.info(
      s"FAILED product: ${state.product.describe}\n " +
        s"test_user: ${state.user.isTestUser}\n" +
        s"error: $error\n"
    )
    sendEmail(state).whenFinished(handleError(state, error, requestInfo))
  }

  private def sendEmail(state: FailureHandlerState): Future[SendMessageResult] = {
    val emailFields = state.product match {
      case c: Contribution => FailedContributionEmailFields(email = state.user.primaryEmailAddress, IdentityUserId(state.user.id))
      case d: DigitalPack => FailedDigitalPackEmailFields(email = state.user.primaryEmailAddress, IdentityUserId(state.user.id))
      case p: Paper => FailedPaperEmailFields(email = state.user.primaryEmailAddress, IdentityUserId(state.user.id))
      case g: GuardianWeekly => FailedGuardianWeeklyEmailFields(email = state.user.primaryEmailAddress, IdentityUserId(state.user.id))
    }
    SafeLogger.info(s"Sending a failure email. Email fields: $emailFields")
    emailService.send(emailFields)
  }

  private def handleError(state: FailureHandlerState, error: Option[ExecutionError], requestInfo: RequestInfo) = {
    SafeLogger.info(s"Attempting to handle error $error")
    val pattern = "No such token: (.*); a similar object exists in test mode, but a live mode key was used to make this request.".r
    error.flatMap(extractUnderlyingError) match {
      case Some(ZuoraErrorResponse(_, List(ze @ ZuoraError("TRANSACTION_FAILED", _)))) =>
        val checkoutFailureReason = toCheckoutFailureReason(ze)
        logLambdaResult(state, PaymentFailure, checkoutFailureReason, error)
        exitHandler(
          state,
          checkoutFailureReason,
          requestInfo.appendMessage(s"Zuora reported a payment failure: $ze")
        )
      case Some(se @ StripeError("card_error", _, _, _, _)) =>
        val checkoutFailureReason = toCheckoutFailureReason(se)
        logLambdaResult(state, PaymentFailure, checkoutFailureReason, error)
        exitHandler(
          state,
          checkoutFailureReason,
          requestInfo.appendMessage(s"Stripe reported a payment failure: ${se.getMessage}")
        )
      case Some(StripeError("invalid_request_error", pattern(message), _, _, _)) =>
        logLambdaResult(state, IgnoredError, AccountMismatch, error)
        exitHandler(
          state,
          AccountMismatch,
          requestInfo.appendMessage(message)
        )
      case _ =>
        logLambdaResult(state, Error, Unknown, error)
        exitHandler(
          state,
          Unknown,
          requestInfo.copy(failed = true)
        )
    }
  }

  private def logLambdaResult(
    state: FailureHandlerState,
    status: LambdaExecutionStatus,
    checkoutFailureReason: CheckoutFailureReason,
    error: Option[ExecutionError]
  ): Unit = {
    val paymentDetails = state.paymentMethod.map(Right(_)).orElse(state.paymentFields.map(Left(_)))
    // Log the result of this execution to Elasticsearch
    LambdaExecutionResult.logResult(
      LambdaExecutionResult(
        state.requestId,
        status,
        state.user.isTestUser,
        state.product,
        paymentDetails,
        state.firstDeliveryDate,
        state.giftRecipient.isDefined,
        state.promoCode,
        state.user.billingAddress.country,
        state.user.deliveryAddress.map(_.country),
        Some(checkoutFailureReason),
        error
      )
    )
  }

  private def exitHandler(
    state: FailureHandlerState,
    checkoutFailureReason: CheckoutFailureReason,
    requestInfo: RequestInfo
  ) = {
    SafeLogger.info(s"Returning CheckoutFailure state...")
    HandlerResult(CheckoutFailureState(state.user, checkoutFailureReason), requestInfo)
  }

}

object FailureHandler {

  private def extractUnderlyingError(executionError: ExecutionError): Option[Throwable] = for {
    errorJson <- decode[ErrorJson](executionError.Cause).toOption
    result <- tryToDecode[ZuoraErrorResponse](errorJson) orElse tryToDecode[StripeError](errorJson)
  } yield result

  private def tryToDecode[T](errorJson: ErrorJson)(implicit decoder: Decoder[T]): Option[T] = decode[T](errorJson.errorMessage).toOption

  def toCheckoutFailureReason(zuoraError: ZuoraError): CheckoutFailureReason = {
    // Just get Stripe's decline code (example message from Zuora: "Transaction declined.do_not_honor - Your card was declined.")
    val trimmedError = zuoraError.Message.stripPrefix("Transaction declined.").split(" ")(0)
    convertStripeDeclineCode(trimmedError).getOrElse(Unknown)
  }

  def toCheckoutFailureReason(stripeError: StripeError): CheckoutFailureReason = {
    stripeError.decline_code.flatMap(error => convertStripeDeclineCode(error)).getOrElse(Unknown)
  }

}
