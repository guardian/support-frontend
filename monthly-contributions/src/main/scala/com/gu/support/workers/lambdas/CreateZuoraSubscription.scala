package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.workers.model.CreateZuoraSubscriptionState
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class CreateZuoraSubscription extends FutureHandler[CreateZuoraSubscriptionState, String] with LazyLogging {
  override protected def handlerFuture(state: CreateZuoraSubscriptionState, context: Context) = Future.successful("success")
}
