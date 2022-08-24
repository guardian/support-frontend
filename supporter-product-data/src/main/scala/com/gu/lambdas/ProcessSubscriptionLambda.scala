package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.lambdas.ProcessSubscriptionLambda.processSubscriptions
import com.typesafe.scalalogging.StrictLogging

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ProcessSubscriptionLambda extends Handler[Unit, Unit] {
  override protected def handlerFuture(input: Unit, context: Context) = processSubscriptions()

}

object ProcessSubscriptionLambda extends StrictLogging {
  def processSubscriptions() =
    Future.successful(logger.info("Processing a subscription"))
}
