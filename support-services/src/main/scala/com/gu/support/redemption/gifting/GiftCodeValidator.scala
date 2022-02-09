package com.gu.support.redemption.gifting

import com.gu.support.redemption.gifting.GiftCodeValidator.{expirationTimeInMonths, getSubscriptionState}
import com.gu.support.redemption.{
  CodeAlreadyUsed,
  CodeExpired,
  CodeNotFound,
  CodeRedeemedInThisRequest,
  CodeStatus,
  ValidGiftCode,
}
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.zuora.api.response.SubscriptionRedemptionQueryResponse
import com.gu.zuora.{ZuoraGiftLookupService, ZuoraService}
import org.joda.time.LocalDate

import scala.concurrent.{ExecutionContext, Future}

object GiftCodeValidator {
  val expirationTimeInMonths = 12

  def getSubscriptionState(existingSub: SubscriptionRedemptionQueryResponse, requestId: Option[String]): CodeStatus =
    existingSub.records match {
      case existingSubFields :: Nil
          if existingSubFields.contractEffectiveDate.plusMonths(expirationTimeInMonths).isBefore(LocalDate.now()) =>
        CodeExpired
      case existingSubFields :: Nil if existingSubFields.gifteeIdentityId.isEmpty =>
        ValidGiftCode(existingSubFields.id)
      case existingSubFields :: Nil if requestId.contains(existingSubFields.createdRequestId) =>
        CodeRedeemedInThisRequest(existingSubFields.id)
      case _ :: Nil =>
        CodeAlreadyUsed
      case _ =>
        CodeNotFound
    }
}

class GiftCodeValidator(zuoraLookupService: ZuoraGiftLookupService) {

  def getStatus(redemptionCode: RedemptionCode, requestId: Option[String])(implicit
      ec: ExecutionContext,
  ): Future[CodeStatus] =
    zuoraLookupService
      .getSubscriptionFromRedemptionCode(redemptionCode)
      .map(response => getSubscriptionState(response, requestId))

}
