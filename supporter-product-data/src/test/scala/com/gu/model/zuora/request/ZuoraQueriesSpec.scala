package com.gu.model.zuora.request

import com.typesafe.scalalogging.LazyLogging
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

import java.time.LocalDate

class ZuoraQueriesSpec extends AnyFlatSpec with Matchers with LazyLogging {
  "ExportZoqlQueries" should "be correct" in {
    val date = LocalDate.of(2011, 11, 1)
    val expected = """SELECT
          Account.IdentityId__c,
          RatePlan.Id,
          ProductRatePlan.Id,
          RatePlan.Name,
          Subscription.TermEndDate
            FROM
            rateplan
            WHERE
            Account.IdentityId__c != null AND
            Subscription.Status = 'Active' AND
            ProductRatePlan.Id != '2c92c0f852f2ebb20152f9269f067819'
            Subscription.TermEndDate >= '2011-11-01'
    """
    val actual = ExportZoqlQueries.selectActiveRatePlans(date)
    logger.info(actual)
    actual shouldEqual expected
  }
}
