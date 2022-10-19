package com.gu.patrons.lambdas

import com.amazonaws.services.lambda.runtime.{Context, RequestHandler}
import com.gu.monitoring.SafeLogger

class PatronCancelledEventLambda extends RequestHandler[PatronCancelledInputEvent, Unit] {

  override def handleRequest(input: PatronCancelledInputEvent, context: Context) = {
    SafeLogger.info(s"CountryId is ${input.countryId}")
  }
}

case class PatronCancelledInputEvent(countryId: String)
