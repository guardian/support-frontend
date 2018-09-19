package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.emailservices.{EmailService, FailedContributionEmailFields, FailedDigitalPackEmailFields}
import com.gu.helpers.FutureExtensions._
import com.gu.monitoring.SafeLogger
import com.gu.stripe.Stripe.StripeError
import com.gu.support.workers.encoding.ErrorJson
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.CheckoutFailureReasons._
import com.gu.support.workers.model.states.{CheckoutFailureState, FailureHandlerState}
import com.gu.support.workers.model.{ExecutionError, RequestInfo, Contribution, DigitalPack}
import com.gu.zuora.model.response.{ZuoraError, ZuoraErrorResponse}
import io.circe.Decoder
import io.circe.parser.decode

import scala.concurrent.ExecutionContext.Implicits.global

class FailureHandler(emailService: EmailService) extends FutureHandler[FailureHandlerState, CheckoutFailureState] {

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

  private def sendEmail(state: FailureHandlerState) = {
    val emailFields = state.product match {
      case c: Contribution => FailedContributionEmailFields(email = state.user.primaryEmailAddress, None, Some(state.user.id))
      case d: DigitalPack => FailedDigitalPackEmailFields(email = state.user.primaryEmailAddress, None, Some(state.user.id))
    }
    SafeLogger.info(s"Sending a failure email. Email fields: $emailFields")
    emailService.send(emailFields)
  }

  private def handleError(state: FailureHandlerState, error: Option[ExecutionError], requestInfo: RequestInfo) = {
    SafeLogger.info(s"Attempting to handle error $error")
    error.flatMap(extractUnderlyingError) match {
      case Some(ZuoraErrorResponse(_, List(ze @ ZuoraError("TRANSACTION_FAILED", _)))) => exitHandler(
        state,
        toCheckoutFailureReason(ze),
        requestInfo.appendMessage(s"Zuora reported a payment failure: $ze")
      )
      case Some(se @ StripeError("card_error", _, _, _, _)) => exitHandler(
        state,
        toCheckoutFailureReason(se),
        requestInfo.appendMessage(s"Stripe reported a payment failure: ${se.getMessage}")
      )
      case _ => exitHandler(
        state,
        Unknown,
        requestInfo.copy(failed = true)
      )
    }
  }

  private def exitHandler(
    state: FailureHandlerState,
    checkoutFailureReason: CheckoutFailureReason,
    requestInfo: RequestInfo
  ) = {
    SafeLogger.info(s"Returning CheckoutFailure state...")
    HandlerResult(CheckoutFailureState(state.user, checkoutFailureReason), requestInfo)
  }

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
