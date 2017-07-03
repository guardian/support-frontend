package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.support.workers.Conversions.FromOutputStream
import com.gu.support.workers.Fixtures._
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.lambdas.CreateZuoraSubscription
import com.gu.support.workers.model.monthlyContributions.state.SendThankYouEmailState
import com.gu.test.tags.annotations.IntegrationTest

@IntegrationTest
class CreateZuoraSubscriptionSpec extends LambdaSpec {

  "CreateZuoraSubscription lambda" should "create a Zuora subscription" in {
    val createZuora = new CreateZuoraSubscription()

    val outStream = new ByteArrayOutputStream()

    createZuora.handleRequest(wrap(createZuoraSubscriptionJson), outStream, context)

    val sendThankYouEmail = Encoding.in[SendThankYouEmailState](outStream.toInputStream()).get
    sendThankYouEmail.accountNumber.length should be > 0
  }
}
