package com.gu.patrons.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.lambdas.Handler
import com.gu.model.states.FetchResultsState
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.{PatronsIdentityConfig, StripePatronsConfig}
import com.gu.patrons.model.IdentityIdWithStatus
import com.gu.patrons.services.{PatronsIdentityService, StripeService}
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
    val runner = configurableFutureRunner(60.seconds)
    for {
      stripeConfig <- StripePatronsConfig.fromParameterStore(DEV)
      stripeService = new StripeService(stripeConfig, runner)
      subscriptions <- stripeService.getSubscriptions(3)

      identityConfig <- PatronsIdentityConfig.fromParameterStore(DEV)
      identityService = new PatronsIdentityService(identityConfig, runner)
      identityIdsWithStatuses <- Future.sequence(
        subscriptions.data.map(subscription =>
          identityService
            .getOrCreateUserFromEmail(subscription.customer.email, subscription.customer.name)
            .map(id => IdentityIdWithStatus(id, subscription.status)),
        ),
      )
    } yield identityIdsWithStatuses
  }
}
