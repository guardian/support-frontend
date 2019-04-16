package com.gu.aws

import com.gu.aws.AwsCloudWatchMetricPut.{catalogFailureRequest, client}
import com.gu.support.config.TouchPointEnvironments
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.{AsyncFlatSpec, Matchers}

@IntegrationTest
class AwsCloudWatchMetricPutSpec extends AsyncFlatSpec with Matchers {

  "CatalogFailures" should "be logged to CloudWatch" in {
    AwsCloudWatchMetricPut(client)(catalogFailureRequest(TouchPointEnvironments.SANDBOX))
      .fold(
        err => fail(err),
        _ => succeed
      )
  }
}
