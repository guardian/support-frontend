package com.gu.support.workers.exceptions

import com.amazonaws.services.kms.model.AWSKMSException
import com.gu.paypal.PayPalError
import com.gu.salesforce.Salesforce.SalesforceErrorResponse
import com.gu.stripe.Stripe
import com.gu.support.workers.exceptions.RetryImplicits._
import com.gu.zuora.model.ZuoraErrorResponse

/**
 * Maps exceptions from the application to either fatal or non fatal exceptions
 * based on whether we think retrying them has a chance of succeeding
 * see support-workers/docs/error-handling.md
 */
object ErrorHandler {
  val handleException: PartialFunction[Throwable, Any] = {
    //Stripe
    case e: Stripe.Error => throw e.asRetryException
    //PayPal
    case e: PayPalError => throw e.asRetryException
    //AWS encryption SDK
    case e: AWSKMSException => throw e.asRetryException
    //Zuora
    case e: ZuoraErrorResponse => throw e.asRetryException
    //Salesforce
    case e: SalesforceErrorResponse => throw e.asRetryException
    //Any Exception that we haven't specifically handled
    case e: Throwable => throw e.asRetryException
  }
}
