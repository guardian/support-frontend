package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.lambdas.ProcessSubscriptionLambda.processSubscription
import com.gu.model.sqs.SqsEvent
import com.typesafe.scalalogging.StrictLogging

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ProcessSubscriptionLambda extends Handler[SqsEvent, Unit] {

  override protected def handlerFuture(input: SqsEvent, context: Context) =
    Future.sequence(input.Records.map(record => processSubscription(record.body))).map(_ => ())
}

object ProcessSubscriptionLambda extends StrictLogging {
  def processSubscription(subscription: String) =
    Future.successful(logger.info(s"Processing a subscription: $subscription"))
}
