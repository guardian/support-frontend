package com.gu.aws

import com.gu.support.config.Stages
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class AwsCloudWatchMetricPutSpec extends AsyncFlatSpec with Matchers {

  "serverSideCreateFailure" should "be logged to CloudWatch" in {
    AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(AwsCloudWatchMetricSetup.serverSideCreateFailure(Stages.CODE))
      .fold(
        err => fail(err),
        _ => succeed,
      )
  }
}
