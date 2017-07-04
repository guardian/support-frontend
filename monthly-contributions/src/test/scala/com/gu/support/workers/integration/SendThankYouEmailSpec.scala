package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.support.workers.Fixtures.{thankYouEmailJson, wrapFixture}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.lambdas.SendThankYouEmail
import com.gu.test.tags.annotations.IntegrationTest

@IntegrationTest
class SendThankYouEmailSpec extends LambdaSpec {

  "SendThankYouEmail lambda" should "add message to sqs queue" in {
    val sendThankYouEmail = new SendThankYouEmail()

    val outStream = new ByteArrayOutputStream()

    sendThankYouEmail.handleRequest(wrapFixture(thankYouEmailJson), outStream, context)

    assertUnit(outStream)
  }
}
