package com.gu.patrons.lambdas

import com.amazonaws.services.lambda.runtime.{Context, RequestHandler}
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.{PatronsIdentityConfig, PatronsStripeConfig}
import com.gu.patrons.lambdas.ProcessStripeSubscriptionsLambda.processSubscriptions
import com.gu.patrons.model.StageConstructors
import com.gu.patrons.services.{
  PatronsIdentityService,
  PatronsStripeService,
  SkipMissingIdentityProcessor,
  StripeSubscriptionsProcessor,
}
import com.gu.supporterdata.model.Stage
import com.gu.supporterdata.services.SupporterDataDynamoService

import scala.concurrent.duration.{Duration, DurationInt, MILLISECONDS}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Await, Future}

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
        // TODO: this processor will skip any patrons without an Identity account rather than creating one for them
        // This is just for the initial data import so that we can do some preparatory comms to patrons who have
        // been with us for a while but don't have an account, so that they don't get a confusing
        // 'welcome to the guardian' email out of the blue. Once these people have been informed switch over to
        // a CreateMissingIdentityProcessor
        new SkipMissingIdentityProcessor(identityService, dynamoService),
      )
      _ <- processor.processSubscriptions(100)
    } yield ()
  }
}
