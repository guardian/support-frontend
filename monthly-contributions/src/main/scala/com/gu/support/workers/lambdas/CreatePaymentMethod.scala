package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.workers.helpers.Handler
import com.gu.support.workers.model.{PayPalPaymentFields, PaymentMethod, StripePaymentFields}
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._


class CreatePaymentMethod extends Handler[Either[StripePaymentFields, PayPalPaymentFields], PaymentMethod] with LazyLogging {
  override protected def handler(paymentFields: Either[StripePaymentFields, PayPalPaymentFields], context: Context) = {
    logger.info(s"paymentFields: $paymentFields")
    paymentFields match {
      case Left(stripe) => PaymentMethod("Credit card")
      case Right(payPal) => PaymentMethod("PayPal")
    }
  }
}
