package com.gu.services

import com.gu.model.FieldsToExport._
import com.gu.model.Stage
import com.gu.model.Stage.{DEV, PROD}

import java.time.LocalDate

object SelectActiveRatePlansQuery {

  val name = "select-active-rate-plans"

  val isNotDSGift = "Subscription.RedemptionCode__c = ''"
  val isRedeemedDSGift = s"(Subscription.RedemptionCode__c != '' AND ${gifteeIdentityId.zuoraName} != '')"

  def excludeDiscountProductRatePlans(discountProductRatePlanIds: List[String]) =
    discountProductRatePlanIds
      .map(discountProductRatePlanId => s"${productRatePlanId.zuoraName} != '$discountProductRatePlanId'")
      .mkString(" AND\n")

  def query(date: LocalDate, discountProductRatePlanIds: List[String]): String =
    s"""SELECT
          RatePlan.AmendmentType,
          Subscription.Id,
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
            (RatePlan.AmendmentType is null OR RatePlan.AmendmentType = 'NewProduct' OR RatePlan.AmendmentType = 'UpdateProduct') AND
            ${excludeDiscountProductRatePlans(discountProductRatePlanIds)} AND
            ${identityId.zuoraName} != null AND ${identityId.zuoraName} != '' AND
            ($isNotDSGift OR $isRedeemedDSGift)
    """

}
