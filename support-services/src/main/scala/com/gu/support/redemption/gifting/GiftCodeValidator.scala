package com.gu.support.redemption.gifting

import com.gu.support.redemption.gifting.GiftCodeValidator.{expirationTimeInMonths, getSubscriptionState}
import com.gu.support.redemption.{CodeAlreadyUsed, CodeExpired, CodeNotFound, CodeRedeemedInThisRequest, CodeValidationResult, ValidGiftCode}
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.zuora.api.response.SubscriptionRedemptionQueryResponse
import com.gu.zuora.ZuoraService
import org.joda.time.LocalDate

import scala.concurrent.{ExecutionContext, Future}

object GiftCodeValidator {
  val expirationTimeInMonths = 12

  def getSubscriptionState(existingSub: SubscriptionRedemptionQueryResponse, requestId: String): CodeValidationResult =
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

class GiftCodeValidator(zuoraService: ZuoraService) {

  def validate(redemptionCode: RedemptionCode, requestId: String)(implicit ec: ExecutionContext): Future[CodeValidationResult] =
    zuoraService.getSubscriptionFromRedemptionCode(redemptionCode).map(response => getSubscriptionState(response, requestId))

}
