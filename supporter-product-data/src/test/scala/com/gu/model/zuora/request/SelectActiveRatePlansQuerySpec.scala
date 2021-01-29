package com.gu.model.zuora.request

import com.gu.services.SelectActiveRatePlansQuery
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

import java.time.LocalDate

class SelectActiveRatePlansQuerySpec extends AnyFlatSpec with Matchers with LazyLogging {
  "SelectActiveRatePlansQuery" should "be correct" in {
    val date = LocalDate.of(2011, 11, 1)
    val expected = """SELECT
          Account.IdentityId__c,
          Subscription.GifteeIdentityId__c,
          RatePlan.Id,
          ProductRatePlan.Id,
          ProductRatePlan.Name,
          Subscription.TermEndDate
            FROM
            rateplan
            WHERE
            Subscription.TermEndDate >= '2011-11-01' AND
            (Subscription.Status = 'Active' OR Subscription.Status = 'Cancelled') AND
            ProductRatePlan.Id != '2c92c0f852f2ebb20152f9269f067819' AND
ProductRatePlan.Id != '2c92c0f852f2ebb20152f9269f067818' AND
            Account.IdentityId__c != null AND Account.IdentityId__c != '' AND
            (Subscription.RedemptionCode__c = '' OR (Subscription.RedemptionCode__c != '' AND Subscription.GifteeIdentityId__c != ''))
    """
    val actual = SelectActiveRatePlansQuery.query(date, List("2c92c0f852f2ebb20152f9269f067819", "2c92c0f852f2ebb20152f9269f067818"))
    logger.info(actual)
    actual shouldEqual expected
  }
}
