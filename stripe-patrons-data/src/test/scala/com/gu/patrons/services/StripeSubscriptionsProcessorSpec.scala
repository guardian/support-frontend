package com.gu.patrons.services

import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.{PatronsIdentityConfig, PatronsStripeConfig}
import com.gu.patrons.model.{StripeSubscription, ExpandedStripeCustomer}
import com.gu.supporterdata.model.Stage.{DEV, PROD}
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.duration.DurationInt

@IntegrationTest
class StripeSubscriptionsProcessorSpec extends AsyncFlatSpec with Matchers {
  "StripeSubscriptionsProcessor" should "process subscriptions from Stripe" in {
    val stage = DEV
    val runner = configurableFutureRunner(60.seconds)
    for {
      stripeConfig <- PatronsStripeConfig.fromParameterStore(stage)
      stripeService = new PatronsStripeService(stripeConfig, runner)
      identityConfig <- PatronsIdentityConfig.fromParameterStore(stage)
      identityService = new PatronsIdentityService(identityConfig, runner)
      loggingProcessor = new LoggingSubscriptionProcessor(identityService)
      processor = new StripeSubscriptionsProcessor(stripeService, loggingProcessor)
      _ <- processor.processSubscriptions(GnmPatronScheme, 100)
    } yield succeed
  }

  class LoggingSubscriptionProcessor(identityService: PatronsIdentityService) extends SubscriptionProcessor {
    override def processSubscription(subscription: StripeSubscription[ExpandedStripeCustomer]) =
      identityService
        .getUserIdFromEmail(subscription.customer.email)
        .map(maybeIdentityId =>
          SafeLogger.info(s"${subscription.customer.email} - ${maybeIdentityId.getOrElse("No Identity account")}"),
        )
  }

}
