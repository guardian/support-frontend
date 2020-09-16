package com.gu.support.workers

import com.gu.support.SerialisationTestHelpers
import com.gu.support.workers.lambdas.DigitalSubscriptionGiftRedemption
import com.gu.support.workers.lambdas.DigitalSubscriptionGiftRedemption.{Expired, Redeemed, RedeemedInThisRequest, Unredeemed}
import com.gu.support.zuora.api.response.{SubscriptionRedemptionFields, SubscriptionRedemptionQueryResponse}
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec

class DigitalSubscriptionGiftRedemptionSpec extends AnyFlatSpec with SerialisationTestHelpers {

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
    val expiredDate = LocalDate.now().minusYears(1).minusDays(1)
    val expiredResponse = SubscriptionRedemptionQueryResponse(
      List(SubscriptionRedemptionFields(
        id = "1",
        contractEffectiveDate = expiredDate,
        createdRequestId = "123",
        gifteeIdentityId = None)
      ))
    DigitalSubscriptionGiftRedemption
      .getSubscriptionState(expiredResponse, "456")
      .clientCode shouldBe Expired.clientCode

    val nonExpiredDate = LocalDate.now().minusYears(1)
    val nonExpiredResponse = SubscriptionRedemptionQueryResponse(
      List(SubscriptionRedemptionFields(
        id = "1",
        contractEffectiveDate = nonExpiredDate,
        createdRequestId = "123",
        gifteeIdentityId = None)
      ))
    DigitalSubscriptionGiftRedemption
      .getSubscriptionState(nonExpiredResponse, "456")
      .clientCode shouldBe Unredeemed.clientCode
  }
}
