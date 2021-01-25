package com.gu.model.zuora.request

import com.gu.model.zuora.request.ExportZoqlQueryObject.SelectActiveRatePlans
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

import java.time.LocalDate

class ExportZoqlQueriesSpec extends AnyFlatSpec with Matchers with LazyLogging {
  "ExportZoqlQueryObject" should "be correct" in {
    val date = LocalDate.of(2011, 11, 1)
    val expected = """SELECT
          Account.IdentityId__c,
          RatePlan.Id,
          ProductRatePlan.Id,
          ProductRatePlan.Name,
          Subscription.TermEndDate
            FROM
            rateplan
            WHERE
            Account.IdentityId__c != null AND
            Subscription.Status = 'Active' AND
            ProductRatePlan.Id != '2c92c0f852f2ebb20152f9269f067819' AND
            Subscription.TermEndDate >= '2011-11-01'
    """
    val actual = SelectActiveRatePlans.query(date)
    logger.info(actual)
    actual shouldEqual expected
  }
}
