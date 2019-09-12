package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.salesforce.Fixtures.salesforceId
import com.gu.support.workers.{AsyncLambdaSpec, MockContext}
import com.gu.support.workers.JsonFixtures.{createSalesForceContactJson, wrapFixture}
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.lambdas.CreateSalesforceContact
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.test.tags.annotations.IntegrationTest

@IntegrationTest
class CreateSalesforceContactSpec extends AsyncLambdaSpec with MockContext {

  "CreateSalesforceContact lambda" should "upsert a SalesforceContactRecord" in {
    val createContact = new CreateSalesforceContact()

    val outStream = new ByteArrayOutputStream()

    createContact.handleRequestFuture(wrapFixture(createSalesForceContactJson), outStream, context).map { _ =>

      val result = Encoding.in[CreateZuoraSubscriptionState](outStream.toInputStream)
      result.isSuccess should be(true)
      val contacts = result.get._1.salesforceContacts
      contacts.buyer.Id should be(salesforceId)
      contacts.giftRecipient shouldBe defined
    }
  }

}
