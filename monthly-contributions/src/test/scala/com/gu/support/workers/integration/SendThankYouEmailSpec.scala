package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.support.workers.Conversions.FromOutputStream
import com.gu.support.workers.Fixtures.{thankYouEmailJson, wrap}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.lambdas.SendThankYouEmail
import com.gu.test.tags.annotations.IntegrationTest

@IntegrationTest
class SendThankYouEmailSpec extends LambdaSpec {

  "SendThankYouEmail lambda" should "add message to sqs queue" in {
    val sendThankYouEmail = new SendThankYouEmail()

    val outStream = new ByteArrayOutputStream()

    sendThankYouEmail.handleRequest(wrap(thankYouEmailJson), outStream, context)

    val state = Encoding.in[Unit](outStream.toInputStream())
    state.isSuccess should be(true)
  }
}
