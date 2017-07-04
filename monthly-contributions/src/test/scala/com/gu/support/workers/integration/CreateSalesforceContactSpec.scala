package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.salesforce.Fixtures.salesforceId
import com.gu.support.workers.Conversions.FromOutputStream
import com.gu.support.workers.Fixtures.{createSalesForceContactJson, wrapFixture}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.lambdas.CreateSalesforceContact
import com.gu.support.workers.model.monthlyContributions.state.CreateZuoraSubscriptionState
import com.gu.test.tags.annotations.IntegrationTest

@IntegrationTest
class CreateSalesforceContactSpec extends LambdaSpec {

  "CreateSalesforceContact lambda" should "retrieve a SalesforceContactRecord" in {
    val createContact = new CreateSalesforceContact()

    val outStream = new ByteArrayOutputStream()

    createContact.handleRequest(wrapFixture(createSalesForceContactJson), outStream, context)

    val result = Encoding.in[CreateZuoraSubscriptionState](outStream.toInputStream)
    result.isSuccess should be(true)
    result.get.salesForceContact.Id should be(salesforceId)
  }
}
