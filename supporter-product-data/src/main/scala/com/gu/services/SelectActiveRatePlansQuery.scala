package com.gu.services

import com.gu.model.FieldsToExport._
import com.gu.model.Stage
import com.gu.model.Stage.{CODE, PROD}

import java.time.LocalDate

object SelectActiveRatePlansQuery {

  val name = "select-active-rate-plans"

  val isNotDSGift = "Subscription.RedemptionCode__c = ''"
  val isRedeemedDSGift = s"(Subscription.RedemptionCode__c != '' AND ${gifteeIdentityId.zuoraName} != '')"

  def query(date: LocalDate, discountProductRatePlanId: String): String =
    s"""SELECT
          ${identityId.zuoraName},
          ${gifteeIdentityId.zuoraName},
          ${ratePlanId.zuoraName},
          ${productRatePlanId.zuoraName},
          ${productRatePlanName.zuoraName},
          ${termEndDate.zuoraName}
            FROM
            rateplan
            WHERE
            ${termEndDate.zuoraName} >= '$date' AND
            (Subscription.Status = 'Active' OR Subscription.Status = 'Cancelled') AND
            ${productRatePlanId.zuoraName} != '$discountProductRatePlanId' AND
            ${identityId.zuoraName} != null AND
            ($isNotDSGift OR $isRedeemedDSGift)
    """

}
