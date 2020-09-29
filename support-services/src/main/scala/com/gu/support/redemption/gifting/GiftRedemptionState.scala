package com.gu.support.redemption.gifting

import com.gu.support.zuora.api.response.SubscriptionRedemptionQueryResponse
import org.joda.time.LocalDate

object GiftRedemptionState {

  val expirationTimeInMonths = 12

  def getSubscriptionState(existingSub: SubscriptionRedemptionQueryResponse, requestId: String) =
    existingSub.records match {
      case existingSubFields :: Nil if existingSubFields.contractEffectiveDate.plusMonths(expirationTimeInMonths).isBefore(LocalDate.now()) =>
        Expired
      case existingSubFields :: Nil if existingSubFields.gifteeIdentityId.isEmpty =>
        Unredeemed(existingSubFields.id)
      case existingSubFields :: Nil if existingSubFields.createdRequestId == requestId =>
        RedeemedInThisRequest
      case _ :: Nil =>
        Redeemed
      case _ =>
        NotFound
    }

}
