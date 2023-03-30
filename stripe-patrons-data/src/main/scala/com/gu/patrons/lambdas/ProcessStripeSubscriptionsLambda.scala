package com.gu.patrons.lambdas

import com.amazonaws.services.lambda.runtime.{Context, RequestHandler}
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.{PatronsIdentityConfig, PatronsStripeConfig}
import com.gu.patrons.lambdas.ProcessStripeSubscriptionsLambda.processSubscriptions
import com.gu.patrons.model.StageConstructors
import com.gu.patrons.services.{
  CreateMissingIdentityProcessor,
  PatronsIdentityService,
  PatronsStripeService,
  GnmPatronScheme,
  PatronsStripeAccount,
  StripeSubscriptionsProcessor,
}
import com.gu.supporterdata.services.SupporterDataDynamoService

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.{Duration, DurationInt, MILLISECONDS}

class ProcessStripeSubscriptionsLambda extends RequestHandler[Unit, Unit] {

  override def handleRequest(input: Unit, context: Context) = {
    val account = GnmPatronScheme // TODO: allow this to be set by the caller
    Await.result(
      processSubscriptions(account),
      Duration(context.getRemainingTimeInMillis.toLong, MILLISECONDS),
    )
  }
}

object ProcessStripeSubscriptionsLambda {
  private val stage = StageConstructors.fromEnvironment
  private val stripeConfig = PatronsStripeConfig.fromParameterStore(stage)
  private val identityConfig = PatronsIdentityConfig.fromParameterStore(stage)

  def processSubscriptions(account: PatronsStripeAccount) = {
    val runner = configurableFutureRunner(60.seconds)
    for {
      stripeConfig <- stripeConfig
      stripeService = new PatronsStripeService(stripeConfig, runner)
      identityConfig <- identityConfig
      identityService = new PatronsIdentityService(identityConfig, runner)
      dynamoService = SupporterDataDynamoService(stage)
      processor = new StripeSubscriptionsProcessor(
        stripeService,
        new CreateMissingIdentityProcessor(identityService, dynamoService),
      )
      _ <- processor.processSubscriptions(account, 100)
    } yield ()
  }
}
