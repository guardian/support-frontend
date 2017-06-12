package com.gu.support.workers

import java.io.ByteArrayOutputStream

import com.gu.support.workers.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.Fixtures._
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.lambdas.CreateZuoraSubscription
import com.gu.support.workers.model.monthlyContributions.state.SendThankYouEmailState
import com.gu.test.tags.annotations.IntegrationTest

@IntegrationTest
class CreateZuoraSubscriptionSpec extends LambdaSpec {

  "CreateZuoraSubscription lambda" should "create a Zuora subscription" in {
    val createZuora = new CreateZuoraSubscription()

    val outStream = new ByteArrayOutputStream()

    createZuora.handleRequest(createZuoraSubscriptionJson.asInputStream(), outStream, context)

    val sendThankYouEmail = outStream.toClass[SendThankYouEmailState]
    sendThankYouEmail.accountNumber.length should be > 0
  }
}
