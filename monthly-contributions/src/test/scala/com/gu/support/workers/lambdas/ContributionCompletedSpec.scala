package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.gu.support.workers.Fixtures.{thankYouEmailJson, wrapFixture}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.model.monthlyContributions.state.CompletedState
import com.gu.support.workers.Conversions.FromOutputStream
import com.gu.support.workers.model.monthlyContributions.Status
import com.gu.support.workers.encoding.StateCodecs._

class ContributionCompletedSpec extends LambdaSpec {

  "ContributionCompleted lambda" should "return a successful completed state" in {
    val flowCompleted = new ContributionCompleted

    val outStream = new ByteArrayOutputStream()

    flowCompleted.handleRequest(wrapFixture(thankYouEmailJson), outStream, context)

    val completedState = Encoding.in[CompletedState](outStream.toInputStream)

    completedState.isSuccess should be(true)
    completedState.get.status should be(Status.Success)
    completedState.get.message should be(None)
  }
}
