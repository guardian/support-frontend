package com.gu.support.workers

import com.gu.support.SerialisationTestHelpers
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.{CodeAlreadyUsed, CodeExpired, CodeRedeemedInThisRequest, ValidGiftCode}
import com.gu.support.zuora.api.response.{SubscriptionRedemptionFields, SubscriptionRedemptionQueryResponse}
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec

class DigitalSubscriptionGiftRedemptionSpec extends AnyFlatSpec with SerialisationTestHelpers {

  "DigitalSubscriptionGiftRedemption" should "identify an unredeemed subscription from a SubscriptionRedemptionQueryResponse" in {
    val response =
      SubscriptionRedemptionQueryResponse(List(SubscriptionRedemptionFields("1", LocalDate.now(), "123", None)))
    val state = GiftCodeValidator.getSubscriptionState(response, Some("123"))
    state.clientCode shouldBe ValidGiftCode.clientCode
  }

  it should "identify a redeemed subscription from a SubscriptionRedemptionQueryResponse" in {
    val createdRequestId = "123"
    val thisRequestId = "456"
    val response = SubscriptionRedemptionQueryResponse(
      List(
        SubscriptionRedemptionFields(
          id = "1",
          contractEffectiveDate = LocalDate.now(),
          createdRequestId = createdRequestId,
          gifteeIdentityId = Some("123456789"),
        ),
      ),
    )
    val state = GiftCodeValidator.getSubscriptionState(response, Some(thisRequestId))
    state.clientCode shouldBe CodeAlreadyUsed.clientCode
  }

  it should "identify a 'redeemed in this response' subscription from a SubscriptionRedemptionQueryResponse" in {
    val response = SubscriptionRedemptionQueryResponse(
      List(
        SubscriptionRedemptionFields(
          id = "1",
          contractEffectiveDate = LocalDate.now(),
          createdRequestId = "123",
          gifteeIdentityId = Some("123456789"),
        ),
      ),
    )
    val state = GiftCodeValidator.getSubscriptionState(response, Some("123"))
    state.clientCode shouldBe CodeRedeemedInThisRequest.clientCode
  }

  it should "identify an expired subscription code from a SubscriptionRedemptionQueryResponse" in {
    val expiredDate = LocalDate.now().minusYears(1).minusDays(1)
    val expiredResponse = SubscriptionRedemptionQueryResponse(
      List(
        SubscriptionRedemptionFields(
          id = "1",
          contractEffectiveDate = expiredDate,
          createdRequestId = "123",
          gifteeIdentityId = None,
        ),
      ),
    )
    GiftCodeValidator
      .getSubscriptionState(expiredResponse, Some("456"))
      .clientCode shouldBe CodeExpired.clientCode

    val nonExpiredDate = LocalDate.now().minusYears(1)
    val nonExpiredResponse = SubscriptionRedemptionQueryResponse(
      List(
        SubscriptionRedemptionFields(
          id = "1",
          contractEffectiveDate = nonExpiredDate,
          createdRequestId = "123",
          gifteeIdentityId = None,
        ),
      ),
    )
    GiftCodeValidator
      .getSubscriptionState(nonExpiredResponse, Some("456"))
      .clientCode shouldBe ValidGiftCode.clientCode
  }
}
