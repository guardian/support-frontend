package com.gu.model.zuora.request

import com.gu.services.SelectActiveRatePlansQuery
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

import java.time.LocalDate

class SelectActiveRatePlansQuerySpec extends AnyFlatSpec with Matchers with LazyLogging {

  "SelectActiveRatePlansQuery" should "be correct" in {
    val expected = """SELECT
          Subscription.Name,
          Subscription.Version,
          Account.IdentityId__c,
          Subscription.GifteeIdentityId__c,
          ProductRatePlan.Id,
          ProductRatePlan.Name,
          Subscription.ContractEffectiveDate,
          Subscription.TermEndDate,
          Subscription.Status,
          Subscription.AcquisitionMetadata__c
            FROM
            rateplan
            WHERE
            (Subscription.Status = 'Active' OR Subscription.Status = 'Cancelled') AND
            (RatePlan.AmendmentType is null OR RatePlan.AmendmentType = 'NewProduct' OR RatePlan.AmendmentType = 'UpdateProduct') AND
            ProductRatePlan.Id != '2c92c0f852f2ebb20152f9269f067819' AND
ProductRatePlan.Id != '2c92c0f852f2ebb20152f9269f067818' AND
            Account.IdentityId__c like '_%' AND
            ((Subscription.RedemptionCode__c = '' OR Subscription.RedemptionCode__c is null) OR (Subscription.RedemptionCode__c like '_%' AND Subscription.GifteeIdentityId__c like '_%'))
          ORDER BY Account.IdentityId__c, Subscription.ContractEffectiveDate, Subscription.Name, Subscription.Version
    """
    val actual = SelectActiveRatePlansQuery.query(
      List("2c92c0f852f2ebb20152f9269f067819", "2c92c0f852f2ebb20152f9269f067818"),
    )
    logger.info(actual)
    actual shouldEqual expected
  }
}
