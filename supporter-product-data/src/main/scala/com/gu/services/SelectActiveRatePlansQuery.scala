package com.gu.services

import com.gu.model.FieldsToExport._

import java.time.LocalDate

object SelectActiveRatePlansQuery {
  private val discountProductRatePlanId = "2c92c0f852f2ebb20152f9269f067819"

  val name = "select-active-rate-plans"

  val isNotDSGift = "Subscription.RedemptionCode__c = ''"
  val isRedeemedDSGift = s"(Subscription.RedemptionCode__c != '' AND ${gifteeIdentityId.zuoraName} != '')"

  def fullQuery(date: LocalDate): String = s"$incrementalQuery AND ${termEndDate.zuoraName} >= '$date'"

  def incrementalQuery: String =
    s"""SELECT
          ${identityId.zuoraName},
          ${gifteeIdentityId.zuoraName},
          ${ratePlanId.zuoraName},
          ${productRatePlanId.zuoraName},
          ${productRatePlanName.zuoraName},
          ${termEndDate.zuoraName},
          Subscription.RedemptionCode__c,
          Subscription.GifteeIdentityId__c
            FROM
            rateplan
            WHERE
            (Subscription.Status = 'Active' OR Subscription.Status = 'Cancelled') AND
            ${productRatePlanId.zuoraName} != '$discountProductRatePlanId' AND
            ${identityId.zuoraName} != null AND
            ($isNotDSGift OR $isRedeemedDSGift)
    """

}
