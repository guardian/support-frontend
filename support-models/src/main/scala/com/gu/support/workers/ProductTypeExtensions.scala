package com.gu.support.workers

import com.gu.support.catalog.{Product, ProductRatePlan}
import com.gu.support.config.TouchPointEnvironment

object ProductTypeExtensions {

  protected def productRatePlanFromPlans(
    environment: TouchPointEnvironment,
    ratePlans: Map[TouchPointEnvironment, scala.List[ProductRatePlan[Product]]],
    predicate: ProductRatePlan[Product] => Boolean): Option[ProductRatePlan[Product]] =
    ratePlans.getOrElse(environment, Nil).find(predicate)

  implicit class ContributionExtensions(contribution: Contribution) {
    def productRatePlan(environment: TouchPointEnvironment): Option[ProductRatePlan[Product]] =
      None
  }

  implicit class DigitalPackExtensions(digitalPack: DigitalPack) {
    def productRatePlan(environment: TouchPointEnvironment): Option[ProductRatePlan[Product]] =
      productRatePlanFromPlans(environment, digitalPack.catalogType.ratePlans, productRatePlanPredicate)

    def productRatePlanPredicate(productRatePlan: ProductRatePlan[Product]): Boolean =
      productRatePlan.billingPeriod == digitalPack.billingPeriod
  }

  implicit class PaperExtensions(paper: Paper) {
    def productRatePlan(environment: TouchPointEnvironment): Option[ProductRatePlan[Product]] =
      productRatePlanFromPlans(environment, paper.catalogType.ratePlans, productRatePlanPredicate)

    def productRatePlanPredicate(productRatePlan: ProductRatePlan[Product]): Boolean =
      productRatePlan.fulfilmentOptions == paper.fulfilmentOptions &&
        productRatePlan.productOptions == paper.productOptions
  }

  implicit class GuardianWeeklyExtensions(guardianWeekly: GuardianWeekly) {

    /**
     * Return the productRatePlan for the recurring, non-introductory part of the subscription
     */
    def productRatePlan(environment: TouchPointEnvironment): Option[ProductRatePlan[Product]] =
      productRatePlanFromPlans(environment, guardianWeekly.catalogType.ratePlans, recurringRatePlanPredicate)

    /**
     * Return the productRatePlan for the introductory part of the subscription ie. 6 for 6
     */
    def introductoryRatePlan(environment: TouchPointEnvironment): Option[ProductRatePlan[Product]] =
      productRatePlanFromPlans(environment, guardianWeekly.catalogType.ratePlans, introductoryRatePlanPredicate)

    private def introductoryRatePlanPredicate(productRatePlan: ProductRatePlan[Product]): Boolean = {
      productRatePlan.fulfilmentOptions == guardianWeekly.fulfilmentOptions &&
        productRatePlan.billingPeriod == guardianWeekly.billingPeriod
    }

    private def recurringRatePlanPredicate(productRatePlan: ProductRatePlan[Product]): Boolean = {
      val postIntroductoryBillingPeriod = if (guardianWeekly.billingPeriod == SixWeekly) Quarterly else guardianWeekly.billingPeriod

      productRatePlan.fulfilmentOptions == guardianWeekly.fulfilmentOptions &&
        productRatePlan.billingPeriod == postIntroductoryBillingPeriod
    }
  }

}
