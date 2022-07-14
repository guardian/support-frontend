package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.config.Configuration
import com.gu.emailservices._
import com.gu.helpers.FutureExtensions._
import com.gu.monitoring.SafeLogger
import com.gu.stripe.StripeError
import com.gu.support.encoding.ErrorJson
import com.gu.support.workers.CheckoutFailureReasons._
import com.gu.support.workers._
import com.gu.support.workers.lambdas.FailureHandler.{extractUnderlyingError, toCheckoutFailureReason}
import com.gu.support.workers.states.{CheckoutFailureState, FailureHandlerState}
import com.gu.support.zuora.api.response.{ZuoraError, ZuoraErrorResponse}
import io.circe.Decoder
import io.circe.parser.decode

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class FailureHandler(emailService: EmailService) extends Handler[FailureHandlerState, CheckoutFailureState] {

  def this() = this(new EmailService(Configuration.load().contributionThanksQueueName))

  override protected def handlerFuture(
      state: FailureHandlerState,
      error: Option[ExecutionError],
      requestInfo: RequestInfo,
      context: Context,
  ): FutureHandlerResult = {
    SafeLogger.info(
      s"FAILED product: ${state.product.describe}\n " +
        s"test_user: ${state.user.isTestUser}\n" +
        s"error: $error\n",
    )
    sendEmail(state).whenFinished(handleError(state, error, requestInfo))
  }

  private def sendEmail(state: FailureHandlerState): Future[SendMessageResult] = {
    val emailFields = state.product match {
      case _: Contribution =>
        FailedEmailFields.contribution(email = state.user.primaryEmailAddress, IdentityUserId(state.user.id))
      case _: SupporterPlus =>
        FailedEmailFields.supporterPlus(email = state.user.primaryEmailAddress, IdentityUserId(state.user.id))
      case _: DigitalPack =>
        FailedEmailFields.digitalPack(email = state.user.primaryEmailAddress, IdentityUserId(state.user.id))
      case _: Paper => FailedEmailFields.paper(email = state.user.primaryEmailAddress, IdentityUserId(state.user.id))
      case _: GuardianWeekly =>
        FailedEmailFields.guardianWeekly(email = state.user.primaryEmailAddress, IdentityUserId(state.user.id))
    }
    SafeLogger.info(s"Sending a failure email. Email fields: $emailFields")
    emailService.send(emailFields)
  }

  private def handleError(state: FailureHandlerState, error: Option[ExecutionError], requestInfo: RequestInfo) = {
    SafeLogger.info(s"Attempting to handle error $error")
    val pattern =
      "No such token: (.*); a similar object exists in test mode, but a live mode key was used to make this request.".r
    error.flatMap(extractUnderlyingError) match {
      case Some(ZuoraErrorResponse(_, List(ze @ ZuoraError("TRANSACTION_FAILED", _)))) =>
        val checkoutFailureReason = toCheckoutFailureReason(ze, state.analyticsInfo.paymentProvider)
        exitHandler(
          state,
          checkoutFailureReason,
          requestInfo.appendMessage(s"Zuora reported a payment failure: $ze"),
        )
      case Some(se @ StripeError("card_error", _, _, _, _)) =>
        val checkoutFailureReason = toCheckoutFailureReason(se)
        exitHandler(
          state,
          checkoutFailureReason,
          requestInfo.appendMessage(s"Stripe reported a payment failure: ${se.getMessage}"),
        )
      case Some(StripeError("invalid_request_error", pattern(message), _, _, _)) =>
        exitHandler(
          state,
          AccountMismatch,
          requestInfo.appendMessage(message),
        )
      case _ =>
        exitHandler(
          state,
          Unknown,
          requestInfo.copy(failed = true),
        )
    }
  }

  private def exitHandler(
      state: FailureHandlerState,
      checkoutFailureReason: CheckoutFailureReason,
      requestInfo: RequestInfo,
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

  private def tryToDecode[T](errorJson: ErrorJson)(implicit decoder: Decoder[T]): Option[T] =
    decode[T](errorJson.errorMessage).toOption

  def toCheckoutFailureReason(zuoraError: ZuoraError, paymentProvider: PaymentProvider): CheckoutFailureReason = {
    // Just get the decline code (example message from Zuora: "Transaction declined.do_not_honor - Your card was declined.")
    val trimmedError = zuoraError.Message.stripPrefix("Transaction declined.").split(" ")(0)
    paymentProvider match {
      case AmazonPay => convertAmazonPayDeclineCode(trimmedError)
      case _ => convertStripeDeclineCode(trimmedError).getOrElse(Unknown)
    }
  }

  def toCheckoutFailureReason(stripeError: StripeError): CheckoutFailureReason = {
    stripeError.decline_code.flatMap(error => convertStripeDeclineCode(error)).getOrElse(Unknown)
  }

}
