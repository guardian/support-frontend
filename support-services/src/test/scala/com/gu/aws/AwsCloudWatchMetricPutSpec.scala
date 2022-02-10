package com.gu.aws

import com.gu.aws.AwsCloudWatchMetricSetup.catalogFailureRequest
import com.gu.support.config.TouchPointEnvironments
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class AwsCloudWatchMetricPutSpec extends AsyncFlatSpec with Matchers {

  "CatalogFailures" should "be logged to CloudWatch" in {
    AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(catalogFailureRequest(TouchPointEnvironments.SANDBOX))
      .fold(
        err => fail(err),
        _ => succeed,
      )
  }
}
