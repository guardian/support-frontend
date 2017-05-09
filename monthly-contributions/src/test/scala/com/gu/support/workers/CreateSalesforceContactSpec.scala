package com.gu.support.workers

import java.io.ByteArrayOutputStream

import com.gu.salesforce.Fixtures.salesforceId
import com.gu.support.workers.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.Fixtures.CreateSalesforceContactFixtures.createSalesForceContactJson
import com.gu.support.workers.lambdas.CreateSalesforceContact
import com.gu.support.workers.model.CreateZuoraSubscriptionState
import io.circe.generic.auto._

class CreateSalesforceContactSpec extends LambdaSpec {

  "CreateSalesForceContact lambda" should "retrieve a SalesforceContactRecord" in {
    val createContact = new CreateSalesforceContact()

    val outStream = new ByteArrayOutputStream()

    createContact.handleRequest(createSalesForceContactJson.asInputStream(), outStream, context)

    outStream.toClass[CreateZuoraSubscriptionState]() match {
      case CreateZuoraSubscriptionState(_, _, _, contactRecord) => contactRecord.Id should be(salesforceId)
      case _ => fail()
    }
  }
}
