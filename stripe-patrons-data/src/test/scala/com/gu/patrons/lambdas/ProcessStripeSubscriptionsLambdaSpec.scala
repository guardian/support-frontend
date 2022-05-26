package com.gu.patrons.lambdas

import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class ProcessStripeSubscriptionsLambdaSpec extends AsyncFlatSpec with Matchers {

  ProcessStripeSubscriptionsLambda.getClass.getSimpleName should "process subscriptions" in {
    ProcessStripeSubscriptionsLambda.processSubscriptions.map(result => result shouldBe ())
  }
}
