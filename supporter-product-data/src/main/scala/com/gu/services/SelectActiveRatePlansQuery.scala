package com.gu.services

import com.gu.model.FieldsToExport._

import java.time.LocalDate

object SelectActiveRatePlansQuery {
  private val discountProductRatePlanId = "2c92c0f852f2ebb20152f9269f067819"

  val name = "select-active-rate-plans"

  def query(date: LocalDate): String =
    s"""SELECT
          ${identityId.zuoraName},
          ${ratePlanId.zuoraName},
          ${productRatePlanId.zuoraName},
          ${productRatePlanName.zuoraName},
          ${termEndDate.zuoraName}
            FROM
            rateplan
            WHERE
            ${identityId.zuoraName} != null AND
            (Subscription.Status = 'Active' OR Subscription.Status = 'Cancelled') AND
            ${productRatePlanId.zuoraName} != '$discountProductRatePlanId' AND
            ${termEndDate.zuoraName} >= '$date'
    """
}
