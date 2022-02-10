package com.gu.services

import com.gu.model.ZuoraFieldNames._
import com.gu.supporterdata.model.Stage.{DEV, PROD}
import com.gu.supporterdata.model.Stage

import java.time.LocalDate
import java.time.format.DateTimeFormatter

object SelectActiveRatePlansQuery {

  val name = "select-active-rate-plans"

  val isNotDSGift = "(Subscription.RedemptionCode__c = '' OR Subscription.RedemptionCode__c is null)"
  // _% in a like clause checks that the field has at least one character ie. not '' or null
  val isRedeemedDSGift = s"(Subscription.RedemptionCode__c like '_%' AND $gifteeIdentityId like '_%')"

  def excludeDiscountProductRatePlans(discountProductRatePlanIds: List[String]) =
    discountProductRatePlanIds
      .map(id => s"$productRatePlanId != '$id'")
      .mkString(" AND\n")

  /* -------- Notes on this query -----------
   * Select *
    Subscription status is not actually written to Dynamo, this are only included for debugging purposes. It could be removed at a later
    stage if we felt it was no longer useful.

   * From *
    We select from rateplan because this gives us the best level of granularity to get all the information we need with the minimum amount
    of records returned. We could have used RatePlanCharge instead but this would have returned multiple records for multi-day print subs
    or print + digital subs

   * Where *
    - Subscription.Status -    We are only interested in subs which are active or cancelled, cancelled subs will update the previous active
                               version with the new term end date.

    - RatePlan.AmendmentType - When removing a product from a subscription with an amendment a new rate plan is created with amendment type
                              'RemoveProduct' we are not interested in these rate plans in this system.

    - excludeDiscountProductRatePlans - There are a lot of rate plans in PROD which are only there to provide various discounts - these are
                                        irrelevant to this job

    - identityId like '_%' - This checks that the account this rate plan is attached to has an associated identityId - since the purpose of
                             this data is to provide product information in members-data-api which is keyed off identityId, we're not
                             interested in any accounts which don't have one

    - is not DS gift or is redeemed DS gift - Until digital subscription gifts are redeemed they should not show up in members-data-api and
                                              when they do they should show up against the giftee's identity id not the purchasers

   * Order By *
   Rate plans for the same user id are ordered in ASC order by subscription name and then subscription version
   this makes sure that cancellations are written after the active version of the sub in case we have both (we shouldn't but you never know!)
   */

  def query(discountProductRatePlanIds: List[String]): String =
    s"""SELECT
          $subscriptionName,
          Subscription.Version,
          $identityId,
          $gifteeIdentityId,
          $productRatePlanId,
          $productRatePlanName,
          $contractEffectiveDate,
          $termEndDate,
          $subscriptionStatus
            FROM
            rateplan
            WHERE
            ($subscriptionStatus = 'Active' OR $subscriptionStatus = 'Cancelled') AND
            (RatePlan.AmendmentType is null OR RatePlan.AmendmentType = 'NewProduct' OR RatePlan.AmendmentType = 'UpdateProduct') AND
            ${excludeDiscountProductRatePlans(discountProductRatePlanIds)} AND
            $identityId like '_%' AND
            ($isNotDSGift OR $isRedeemedDSGift)
          ORDER BY $identityId, $contractEffectiveDate, $subscriptionName, Subscription.Version
    """

}
