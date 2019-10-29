package com.gu.support.workers

import com.gu.support.catalog.{Product, ProductRatePlan}

object ProductTypeExtensions {
  implicit class DigitalPackExtensions(digitalPack: DigitalPack) {
    def productRatePlanPredicate(productRatePlan: ProductRatePlan[Product]): Boolean =
      productRatePlan.billingPeriod == digitalPack.billingPeriod
  }

  implicit class PaperExtensions(paper: Paper) {
    def productRatePlanPredicate(productRatePlan: ProductRatePlan[Product]): Boolean =
      productRatePlan.fulfilmentOptions == paper.fulfilmentOptions &&
        productRatePlan.productOptions == paper.productOptions
  }

  implicit class GuardianWeeklyExtensions(guardianWeekly: GuardianWeekly) {

    def introductoryRatePlanPredicate(productRatePlan: ProductRatePlan[Product]): Boolean = {
      productRatePlan.fulfilmentOptions == guardianWeekly.fulfilmentOptions &&
        productRatePlan.billingPeriod == guardianWeekly.billingPeriod
    }

    def recurringRatePlanPredicate(productRatePlan: ProductRatePlan[Product]): Boolean = {
      // For 6 for 6 subscriptions we want to return the productRatePlanId for the recurring ie. non-introductory rate plan
      val postIntroductoryBillingPeriod = if (guardianWeekly.billingPeriod == SixWeekly) Quarterly else guardianWeekly.billingPeriod

      productRatePlan.fulfilmentOptions == guardianWeekly.fulfilmentOptions &&
        productRatePlan.billingPeriod == postIntroductoryBillingPeriod
    }
  }
}
