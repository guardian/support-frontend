package com.gu.model.zuora.request

import java.time.LocalDate

object ZuoraFieldNames {
  val identityId = "Account.IdentityId__c"
  val ratePlanName = "RatePlan.Name"
  val termEndDate = "Subscription.TermEndDate"
}

object ExportZoqlQueries {
  def selectActiveRatePlans(date: LocalDate): String =
    s"""SELECT
          ${ZuoraFieldNames.identityId},
          ${ZuoraFieldNames.ratePlanName},
          ${ZuoraFieldNames.termEndDate}
            FROM
            rateplan
            WHERE
            ${ZuoraFieldNames.identityId} != null AND
            Subscription.Status = 'Active' AND
            ${ZuoraFieldNames.termEndDate} >= '$date'
    """
}
