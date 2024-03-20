package com.gu.patrons.services

import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.{PatronsIdentityConfig, PatronsStripeConfig}
import com.gu.patrons.model.{ExpandedStripeCustomer, StripeSubscription}
import com.gu.supporterdata.model.Stage.CODE
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.duration.DurationInt

@IntegrationTest
class StripeSubscriptionsProcessorSpec extends AsyncFlatSpec with Matchers {
  "StripeSubscriptionsProcessor" should "process subscriptions from Stripe" in {
    val stage = CODE
    val stripeConfig = PatronsStripeConfig.fromParameterStoreSync(stage)
    val identityConfig = PatronsIdentityConfig.fromParameterStoreSync(stage)
    val runner = configurableFutureRunner(60.seconds)
    val stripeService = new PatronsStripeService(stripeConfig, runner)
    val identityService = new PatronsIdentityService(identityConfig, runner)
    val loggingProcessor = new LoggingSubscriptionProcessor(identityService)
    val processor = new StripeSubscriptionsProcessor(stripeService, loggingProcessor)

    for {
      _ <- processor.processSubscriptions(GnmPatronScheme, 100)
    } yield succeed
  }

  class LoggingSubscriptionProcessor(identityService: PatronsIdentityService) extends SubscriptionProcessor {
    override def processSubscription(subscription: StripeSubscription[ExpandedStripeCustomer]) =
      identityService
        .getUserIdFromEmail(subscription.customer.email)
        .map(maybeIdentityId =>
          info(s"${subscription.customer.email} - ${maybeIdentityId.getOrElse("No Identity account")}"),
        )
  }

}
