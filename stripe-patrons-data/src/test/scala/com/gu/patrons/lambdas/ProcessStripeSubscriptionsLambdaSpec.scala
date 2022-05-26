package com.gu.patrons.lambdas

import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class ProcessStripeSubscriptionsLambdaSpec extends AsyncFlatSpec with Matchers {

  ProcessStripeSubscriptionsLambda.getClass.getSimpleName should "process subscriptions" in {
    ProcessStripeSubscriptionsLambda.processSubscriptions.map(result => result shouldBe ())
  }
}
