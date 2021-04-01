package com.gu.support.workers.integration

import com.gu.salesforce.Fixtures.salesforceId
import com.gu.support.workers.JsonFixtures.{createSalesForceContactJson, createSalesForceGiftContactJson, wrapFixture}
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.lambdas.CreateSalesforceContact
import com.gu.support.workers.states.CreateZuoraSubscriptionState.{CreateZuoraSubscriptionContributionState, CreateZuoraSubscriptionGuardianWeeklyState}
import com.gu.support.workers.states.PassThroughState
import com.gu.support.workers.{AsyncLambdaSpec, MockContext}
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.Inside.inside

import java.io.ByteArrayOutputStream

@IntegrationTest
class CreateSalesforceContactSpec extends AsyncLambdaSpec with MockContext {

  "CreateSalesforceContact lambda" should "upsert a SalesforceContactRecord" in {
    val createContact = new CreateSalesforceContact()

    val outStream = new ByteArrayOutputStream()

    createContact.handleRequestFuture(wrapFixture(createSalesForceContactJson), outStream, context).map { _ =>

      val result = Encoding.in[PassThroughState](outStream.toInputStream)
      result.isSuccess should be(true)
      inside(result.get._1.createZuoraSubscriptionState) {
        case state: CreateZuoraSubscriptionContributionState =>
          state.salesForceContact.Id should be("0039E000017tZUEQA2")
      }
    }
  }

  it should "upsert a gift SalesforceContactRecord" in {
    val createContact = new CreateSalesforceContact()

    val outStream = new ByteArrayOutputStream()

    createContact.handleRequestFuture(wrapFixture(createSalesForceGiftContactJson), outStream, context).map { _ =>

      val result = Encoding.in[PassThroughState](outStream.toInputStream)
      result.isSuccess should be(true)
      inside(result.get._1.createZuoraSubscriptionState) {
        case state: CreateZuoraSubscriptionGuardianWeeklyState =>
          state.salesforceContacts.buyer.Id should be(salesforceId)
          state.salesforceContacts.giftRecipient shouldBe defined
      }
    }
  }

}
