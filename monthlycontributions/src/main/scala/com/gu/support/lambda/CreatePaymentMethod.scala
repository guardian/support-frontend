package com.gu.support.lambda


import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.lambda.helpers.Handler
import com.gu.support.lambda.model.{DummyInput, User}
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._


class CreatePaymentMethod extends Handler[DummyInput, User] with LazyLogging {
  override protected def handler(input: DummyInput, context: Context) = {
    logger.info(s"input: $input")
    User("123", "My User")
  }
}
