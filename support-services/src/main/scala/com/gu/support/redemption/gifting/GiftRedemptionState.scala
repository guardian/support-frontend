package com.gu.support.redemption.gifting

import com.gu.support.redemption.{CodeAlreadyUsed, CodeExpired, CodeNotFound, CodeRedeemedInThisRequest, ValidGiftCode}
import com.gu.support.zuora.api.response.SubscriptionRedemptionQueryResponse
import org.joda.time.LocalDate

object GiftRedemptionState {

  val expirationTimeInMonths = 12

  def getSubscriptionState(existingSub: SubscriptionRedemptionQueryResponse, requestId: String) =
    existingSub.records match {
      case existingSubFields :: Nil if existingSubFields.contractEffectiveDate.plusMonths(expirationTimeInMonths).isBefore(LocalDate.now()) =>
        CodeExpired
      case existingSubFields :: Nil if existingSubFields.gifteeIdentityId.isEmpty =>
        ValidGiftCode(existingSubFields.id)
      case existingSubFields :: Nil if existingSubFields.createdRequestId == requestId =>
        CodeRedeemedInThisRequest
      case _ :: Nil =>
        CodeAlreadyUsed
      case _ =>
        CodeNotFound
    }

}
