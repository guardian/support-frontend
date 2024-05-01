package com.gu.aws

import com.gu.aws.AwsCloudWatchMetricSetup.paymentSuccessRequest
import com.gu.i18n.Currency.GBP
import com.gu.support.config.Stages
import com.gu.support.workers.{DirectDebit, Monthly, SupporterPlus}
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import com.gu.support.catalog.NoFulfilmentOptions

@IntegrationTest
class AwsCloudWatchMetricPutSpec extends AsyncFlatSpec with Matchers {

  "payment success request" should "be logged to CloudWatch" in {
    val cloudwatchEvent =
      paymentSuccessRequest(
        Stages.CODE,
        true,
        DirectDebit,
        SupporterPlus(amount = 10, currency = GBP, billingPeriod = Monthly),
      )
    AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(cloudwatchEvent)
      .fold(
        err => fail(err),
        _ => succeed,
      )
  }
}
