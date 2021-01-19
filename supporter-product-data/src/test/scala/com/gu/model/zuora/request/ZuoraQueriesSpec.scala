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
          RatePlan.Name,
          Subscription.TermEndDate
            FROM
            rateplan
            WHERE
            Subscription.Status = 'Active' AND
            Subscription.TermEndDate >= '2011-11-01'
    """
    val actual = ExportZoqlQueries.selectActiveRatePlans(date)
    logger.info(actual)
    actual shouldEqual expected
  }
}
