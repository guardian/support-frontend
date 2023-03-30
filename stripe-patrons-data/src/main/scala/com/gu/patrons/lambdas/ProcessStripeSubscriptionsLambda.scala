package com.gu.patrons.lambdas

import com.amazonaws.services.lambda.runtime.{Context, RequestHandler}
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.{PatronsIdentityConfig, PatronsStripeConfig}
import com.gu.patrons.lambdas.ProcessStripeSubscriptionsLambda.processSubscriptions
import com.gu.patrons.model.StageConstructors
import com.gu.patrons.services.{
  CreateMissingIdentityProcessor,
  GnmPatronScheme,
  PatronsIdentityService,
  PatronsStripeAccount,
  PatronsStripeService,
  StripeSubscriptionsProcessor,
}
import com.gu.supporterdata.model.Stage
import com.gu.supporterdata.services.SupporterDataDynamoService

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.{Duration, DurationInt, MILLISECONDS}

class ProcessStripeSubscriptionsLambda extends RequestHandler[Unit, Unit] {

  private val stage = StageConstructors.fromEnvironment
  private val stripeConfig = PatronsStripeConfig.fromParameterStoreSync(stage)
  private val identityConfig = PatronsIdentityConfig.fromParameterStoreSync(stage)

  override def handleRequest(input: Unit, context: Context) = {
    val account = GnmPatronScheme // TODO: allow this to be set by the caller
    Await.result(
      processSubscriptions(account, stage, stripeConfig, identityConfig),
      Duration(context.getRemainingTimeInMillis.toLong, MILLISECONDS),
    )
  }
}

object ProcessStripeSubscriptionsLambda {

  def processSubscriptions(
      account: PatronsStripeAccount,
      stage: Stage,
      stripeConfig: PatronsStripeConfig,
      identityConfig: PatronsIdentityConfig,
  ) = {
    val runner = configurableFutureRunner(60.seconds)
    val stripeService = new PatronsStripeService(stripeConfig, runner)
    val identityService = new PatronsIdentityService(identityConfig, runner)
    val dynamoService = SupporterDataDynamoService(stage)
    val processor = new StripeSubscriptionsProcessor(
      stripeService,
      new CreateMissingIdentityProcessor(identityService, dynamoService),
    )
    processor.processSubscriptions(account, 100).map(_ => ())
  }
}
