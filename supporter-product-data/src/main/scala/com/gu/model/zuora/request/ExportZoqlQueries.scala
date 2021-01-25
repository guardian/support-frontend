package com.gu.model.zuora.request

import com.gu.model.FieldsToExport._

import java.time.LocalDate

object ExportZoqlQueries {
  val discountProductRatePlanId = "2c92c0f852f2ebb20152f9269f067819"

  def selectActiveRatePlans(date: LocalDate): String =
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
            Subscription.Status = 'Active' AND
            ProductRatePlan.Id != '$discountProductRatePlanId' AND
            ${termEndDate.zuoraName} >= '$date'
    """

  def selectRatePlansStartedOn(date: LocalDate): String =
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
            Subscription.Status = 'Active' AND
            ProductRatePlan.Id != '$discountProductRatePlanId' AND
            Subscription.TermStartDate = '$date'
    """
}
