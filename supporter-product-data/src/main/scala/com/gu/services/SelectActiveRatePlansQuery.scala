package com.gu.services

import com.gu.model.FieldsToExport._
import com.gu.model.Stage
import com.gu.model.Stage.{DEV, PROD}

import java.time.LocalDate

object SelectActiveRatePlansQuery {

  val name = "select-active-rate-plans"

  val isNotDSGift = "(Subscription.RedemptionCode__c = '' OR Subscription.RedemptionCode__c is null)"
  // _% in a like clause checks that the field has at least one character ie. not '' or null
  val isRedeemedDSGift = s"(Subscription.RedemptionCode__c like '_%' AND ${gifteeIdentityId.zuoraName} like '_%')"

  def excludeDiscountProductRatePlans(discountProductRatePlanIds: List[String]) =
    discountProductRatePlanIds
      .map(id => s"${productRatePlanId.zuoraName} != '$id'")
      .mkString(" AND\n")

  def query(discountProductRatePlanIds: List[String]): String =
    s"""SELECT
          RatePlan.AmendmentType,
          Subscription.Id,
          ${identityId.zuoraName},
          ${gifteeIdentityId.zuoraName},
          ${ratePlanId.zuoraName},
          ${productRatePlanId.zuoraName},
          ${productRatePlanName.zuoraName},
          ${termEndDate.zuoraName},
          Subscription.Status
            FROM
            rateplan
            WHERE
            (Subscription.Status = 'Active' OR Subscription.Status = 'Cancelled') AND
            (RatePlan.AmendmentType is null OR RatePlan.AmendmentType = 'NewProduct' OR RatePlan.AmendmentType = 'UpdateProduct') AND
            ${excludeDiscountProductRatePlans(discountProductRatePlanIds)} AND
            ${identityId.zuoraName} like '_%' AND
            ($isNotDSGift OR $isRedeemedDSGift)
    """

}
