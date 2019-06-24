package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.salesforce.Fixtures.salesforceId
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.JsonFixtures.{createSalesForceContactJson, wrapFixture}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.lambdas.CreateSalesforceContact
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.test.tags.annotations.IntegrationTest
import io.circe.generic.auto._

@IntegrationTest
class CreateSalesforceContactSpec extends LambdaSpec {

  "CreateSalesforceContact lambda" should "upsert a SalesforceContactRecord" in {
    val createContact = new CreateSalesforceContact()

    val outStream = new ByteArrayOutputStream()

    createContact.handleRequest(wrapFixture(createSalesForceContactJson), outStream, context)

    val result = Encoding.in[CreateZuoraSubscriptionState](outStream.toInputStream)
    result.isSuccess should be(true)
    val contacts = result.get._1.salesforceContacts
    contacts.buyer.Id should be(salesforceId)
    contacts.giftRecipient shouldBe defined
  }

}
