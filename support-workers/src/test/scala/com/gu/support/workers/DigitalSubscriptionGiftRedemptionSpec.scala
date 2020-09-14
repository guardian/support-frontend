package com.gu.support.workers

import com.gu.support.SerialisationTestHelpers
import com.gu.support.workers.lambdas.DigitalSubscriptionGiftRedemption
import com.gu.support.workers.lambdas.DigitalSubscriptionGiftRedemption.{Expired, Redeemed, RedeemedInThisRequest, Unredeemed}
import com.gu.support.zuora.api.response.{SubscriptionRedemptionFields, SubscriptionRedemptionQueryResponse}
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec

class DigitalSubscriptionGiftRedemptionSpec extends AnyFlatSpec with SerialisationTestHelpers {
  "SubscriptionRedemptionQueryResponse" should "deserialise correctly" in {
    val jsonResponse = """
        {
        "records": [
            {
                "CreatedRequestId__c": "35b4c314-d982-4386-983e-2e8c453f50be",
                "Id": "2c92c0f8742dcaf5017434d002e73a56",
                "ContractEffectiveDate": "2020-08-09"
            }
        ],
        "done": true,
        "size": 1
    }
    """

    testDecoding[SubscriptionRedemptionQueryResponse](
      jsonResponse,
      subResponse => subResponse.records.head.contractEffectiveDate.getDayOfMonth shouldBe 9
    )
  }

  "DigitalSubscriptionGiftRedemption" should "identify an unredeemed subscription from a SubscriptionRedemptionQueryResponse" in {
    val response = SubscriptionRedemptionQueryResponse(List(SubscriptionRedemptionFields("1", LocalDate.now(), "123", None)))
    val state = DigitalSubscriptionGiftRedemption.getSubscriptionState(response, "123")
    state.clientCode shouldBe Unredeemed.clientCode
  }

  it should "identify a redeemed subscription from a SubscriptionRedemptionQueryResponse" in {
    val createdRequestId = "123"
    val thisRequestId = "456"
    val response = SubscriptionRedemptionQueryResponse(
      List(SubscriptionRedemptionFields(
        id = "1",
        contractEffectiveDate = LocalDate.now(),
        createdRequestId = createdRequestId,
        gifteeIdentityId = Some("123456789")
      )))
    val state = DigitalSubscriptionGiftRedemption.getSubscriptionState(response, thisRequestId)
    state.clientCode shouldBe Redeemed.clientCode
  }

  it should "identify a 'redeemed in this response' subscription from a SubscriptionRedemptionQueryResponse" in {
    val response = SubscriptionRedemptionQueryResponse(
      List(SubscriptionRedemptionFields(
        id = "1",
        contractEffectiveDate = LocalDate.now(),
        createdRequestId = "123",
        gifteeIdentityId = Some("123456789"))
      ))
    val state = DigitalSubscriptionGiftRedemption.getSubscriptionState(response, "123")
    state.clientCode shouldBe RedeemedInThisRequest.clientCode
  }

  it should "identify an expired subscription code from a SubscriptionRedemptionQueryResponse" in {
    val response = SubscriptionRedemptionQueryResponse(
      List(SubscriptionRedemptionFields(
        id = "1",
        contractEffectiveDate = new LocalDate(1999, 12, 31),
        createdRequestId = "123",
        gifteeIdentityId = None)
      ))
    val state = DigitalSubscriptionGiftRedemption.getSubscriptionState(response, "456")
    state.clientCode shouldBe Expired.clientCode
  }
}
