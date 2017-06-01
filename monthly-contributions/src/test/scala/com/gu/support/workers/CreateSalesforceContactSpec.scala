package com.gu.support.workers

import java.io.ByteArrayOutputStream

import com.gu.salesforce.Fixtures.salesforceId
import com.gu.support.workers.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.Fixtures.createSalesForceContactJson
import com.gu.support.workers.lambdas.CreateSalesforceContact
import com.gu.support.workers.model.state.CreateZuoraSubscriptionState
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.support.workers.encoding.StateCodecs._

@IntegrationTest
class CreateSalesforceContactSpec extends LambdaSpec {

  "CreateSalesforceContact lambda" should "retrieve a SalesforceContactRecord" in {
    val createContact = new CreateSalesforceContact()

    val outStream = new ByteArrayOutputStream()

    createContact.handleRequest(createSalesForceContactJson.asInputStream(), outStream, context)

    outStream.toClass[CreateZuoraSubscriptionState]().salesForceContact.Id should be(salesforceId)
  }
}
