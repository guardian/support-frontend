package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.workers.helpers.Handler
import com.gu.support.workers.model.{PaymentMethod, User}
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._


class CreatePaymentMethod extends Handler[User, PaymentMethod] with LazyLogging {
  override protected def handler(user: User, context: Context) = {
    logger.info(s"user: $user")
    PaymentMethod("Credit card")
  }
}
