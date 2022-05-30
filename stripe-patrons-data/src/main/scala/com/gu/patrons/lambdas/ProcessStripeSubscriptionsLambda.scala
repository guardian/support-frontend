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
  StripeSubscriptionsProcessor,
}
import com.gu.supporterdata.model.Stage
import com.gu.supporterdata.services.SupporterDataDynamoService

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.{Duration, DurationInt, MILLISECONDS}

class ProcessStripeSubscriptionsLambda extends RequestHandler[Unit, Unit] {

  override def handleRequest(input: Unit, context: Context) = {
    Await.result(
      processSubscriptions(StageConstructors.fromEnvironment),
      Duration(context.getRemainingTimeInMillis.toLong, MILLISECONDS),
    )
  }
}

object ProcessStripeSubscriptionsLambda {
  def processSubscriptions(stage: Stage) = {
    val runner = configurableFutureRunner(60.seconds)
    for {
      stripeConfig <- PatronsStripeConfig.fromParameterStore(stage)
      stripeService = new PatronsStripeService(stripeConfig, runner)
      identityConfig <- PatronsIdentityConfig.fromParameterStore(stage)
      identityService = new PatronsIdentityService(identityConfig, runner)
      dynamoService = SupporterDataDynamoService(stage)
      processor = new StripeSubscriptionsProcessor(
        stripeService,
        new CreateMissingIdentityProcessor(identityService, dynamoService),
      )
      _ <- processor.processSubscriptions(100)
    } yield ()
  }
}
