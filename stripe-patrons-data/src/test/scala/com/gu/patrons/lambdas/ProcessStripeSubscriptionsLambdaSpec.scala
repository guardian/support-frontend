package com.gu.patrons.lambdas

import com.gu.patrons.conf.{PatronsIdentityConfig, PatronsStripeConfig}
import com.gu.supporterdata.model.Stage.DEV
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import com.gu.patrons.services.GnmPatronScheme

@IntegrationTest
class ProcessStripeSubscriptionsLambdaSpec extends AsyncFlatSpec with Matchers {

  ProcessStripeSubscriptionsLambda.getClass.getSimpleName should "process subscriptions" in {
    val stage = DEV
    val stripeConfig = PatronsStripeConfig.fromParameterStoreSync(stage)
    val identityConfig = PatronsIdentityConfig.fromParameterStoreSync(stage)
    ProcessStripeSubscriptionsLambda
      .processSubscriptions(GnmPatronScheme, stage, stripeConfig, identityConfig)
      .map(result => result shouldBe ())
  }
}
