package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.model.states.FetchResultsState
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.StripePatronsConfig
import com.gu.patrons.services.{ConfigService, StripeService}
import com.gu.supporterdata.model.Stage.DEV

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

class FetchStripeSubscriptionsLambda extends Handler[FetchResultsState, Unit] {
  override protected def handlerFuture(input: FetchResultsState, context: Context) =
    Future.successful(())
}

object FetchStripeSubscriptionsLambda {
  def fetchStripeSubscriptionsLambda = {
    for {
      config <- StripePatronsConfig.fromParameterStore(DEV)
      stripeService = new StripeService(config, configurableFutureRunner(60.seconds))
      subscriptions <- stripeService.getSubscriptions()
      // subscription <- subscriptions.data
    } yield subscriptions
  }
}
