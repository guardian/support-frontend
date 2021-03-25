package com.gu.services

import com.gu.model.FieldsToExport._
import com.gu.model.Stage
import com.gu.model.Stage.{DEV, PROD}

import java.time.LocalDate
import java.time.format.DateTimeFormatter

object SelectActiveRatePlansQuery {

  val name = "select-active-rate-plans"

  val isNotDSGift = "(Subscription.RedemptionCode__c = '' OR Subscription.RedemptionCode__c is null)"
  // _% in a like clause checks that the field has at least one character ie. not '' or null
  val isRedeemedDSGift = s"(Subscription.RedemptionCode__c like '_%' AND ${gifteeIdentityId.zuoraName} like '_%')"

  def excludeDiscountProductRatePlans(discountProductRatePlanIds: List[String]) =
    discountProductRatePlanIds
      .map(id => s"${productRatePlanId.zuoraName} != '$id'")
      .mkString(" AND\n")

  /* -------- Notes on this query -----------
    * Select *
    A number of fields in the select clause such as contract effective date and Subscription status are not actually
    written to Dynamo, they are only included for debugging purposes. They could be removed at a later
    stage if we felt they were no longer useful.

    * From *
    We select from rateplan because this gives us the best level of granularity to get all the information
    we need with the minimum amount of records returned. We could have used RatePlanCharge instead but this
    would have returned multiple records for multi-day print subs or print + digital subs

    * Where *
    - Subscription.Status -    We are only interested in subs which are active or cancelled, cancelled subs will update the previous active version with the
                               new term end date. The reason we filter cancelled subs by date is that unlike active subs which change state to expired at the
                               end of their term, cancelled subs hang about forever and we want to avoid extracting them all with this query.
                               The `today.minusDays(366)` part is because cancellations can be backdated to the start of the term they are cancelling - since
                               our longest term is 12 months, going back just before this should get all relevant subs.

    - RatePlan.AmendmentType - When removing a product from a subscription with an amendment a new rate plan is created with amendment type 'RemoveProduct'
                               we are not interested in these rate plans in this system.

    - excludeDiscountProductRatePlans - There are a lot of rate plans in PROD which are only there to provide various discounts - these are irrelevant to this job

    - identityId like '_%' - This checks that the account this rate plan is attached to has an associated identityId - since the purpose of this data is to
                             provide product information in members-data-api which is keyed off identityId, we're not interested in any accounts which don't have one

    - is not DS gift or is redeemed DS gift - Until digital subscription gifts are redeemed they should not show up in members-data-api and when they do they
                                              should show up against the giftee's identity id not the purchasers

   * Order By *
   It's important that rate plans for the same user id are ordered in ASC order by contract effective date so that if a customer cancels a product and then
   resubscribes at a later date we record that correctly
   */

  def query(today: LocalDate, discountProductRatePlanIds: List[String]): String =
    s"""SELECT
          ${subscriptionName.zuoraName},
          Subscription.Version,
          ${identityId.zuoraName},
          ${gifteeIdentityId.zuoraName},
          ${productRatePlanId.zuoraName},
          ${productRatePlanName.zuoraName},
          ${contractEffectiveDate.zuoraName},
          ${termEndDate.zuoraName},
          ${subscriptionStatus.zuoraName}
            FROM
            rateplan
            WHERE
            (
              ${subscriptionStatus.zuoraName} = 'Active' OR
              (${subscriptionStatus.zuoraName} = 'Cancelled' AND Subscription.TermStartDate > '${today.minusDays(366).format(DateTimeFormatter.ISO_LOCAL_DATE)}')
            ) AND
            (RatePlan.AmendmentType is null OR RatePlan.AmendmentType = 'NewProduct' OR RatePlan.AmendmentType = 'UpdateProduct') AND
            ${excludeDiscountProductRatePlans(discountProductRatePlanIds)} AND
            ${identityId.zuoraName} like '_%' AND
            ($isNotDSGift OR $isRedeemedDSGift)
          ORDER BY ${identityId.zuoraName}, ${contractEffectiveDate.zuoraName}, ${subscriptionName.zuoraName}, Subscription.Version
    """

}
