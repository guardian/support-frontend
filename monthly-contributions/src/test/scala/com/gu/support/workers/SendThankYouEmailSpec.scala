package com.gu.support.workers

import java.io.ByteArrayOutputStream
import com.gu.support.workers.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.Fixtures.SendThankYouEmailFixtures.thankYouEmailJson
import com.gu.support.workers.lambdas.SendThankYouEmail

class SendThankYouEmailSpec extends LambdaSpec {

  "SendThankYouEmail lambda" should "add message to sqs queue" in {
    val sendThankYouEmail = new SendThankYouEmail()

    val outStream = new ByteArrayOutputStream()

    sendThankYouEmail.handleRequest(thankYouEmailJson.asInputStream(), outStream, context)

    outStream.toClass[Unit]() shouldEqual (())
  }
}
