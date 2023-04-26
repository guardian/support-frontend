package com.gu.support.workers

import com.gu.support.catalog
import com.gu.support.catalog.GuardianWeekly.postIntroductorySixForSixBillingPeriod
import com.gu.support.catalog.{Product, ProductRatePlan, SupporterPlusV1, SupporterPlusV2}
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.zuora.api.ReaderType

object ProductTypeRatePlans {

  def weeklyRatePlan(
      product: GuardianWeekly,
      environment: TouchPointEnvironment,
      readerType: ReaderType,
  ): Option[ProductRatePlan[catalog.GuardianWeekly.type]] = {
    val postIntroductoryBillingPeriod =
      if (product.billingPeriod == SixWeekly) postIntroductorySixForSixBillingPeriod else product.billingPeriod
    catalog.GuardianWeekly.ratePlans
      .getOrElse(environment, Nil)
      .find(productRatePlan =>
        productRatePlan.fulfilmentOptions == product.fulfilmentOptions &&
          productRatePlan.billingPeriod == postIntroductoryBillingPeriod &&
          productRatePlan.readerType == readerType,
      )
  }

  /** Return the productRatePlan for the introductory part of the subscription ie. 6 for 6
    */
  def weeklyIntroductoryRatePlan(
      guardianWeekly: GuardianWeekly,
      environment: TouchPointEnvironment,
  ): Option[ProductRatePlan[catalog.GuardianWeekly.type]] =
    catalog.GuardianWeekly.ratePlans
      .getOrElse(environment, Nil)
      .find(productRatePlan =>
        productRatePlan.fulfilmentOptions == guardianWeekly.fulfilmentOptions &&
          productRatePlan.billingPeriod == SixWeekly,
      )

  def digitalRatePlan(
      product: DigitalPack,
      environment: TouchPointEnvironment,
  ): Option[ProductRatePlan[catalog.DigitalPack.type]] =
    catalog.DigitalPack.ratePlans
      .getOrElse(environment, Nil)
      .find(productRatePlan =>
        productRatePlan.billingPeriod == product.billingPeriod && productRatePlan.readerType == product.readerType,
      )

  def supporterPlusRatePlanV1(
      product: SupporterPlus,
      environment: TouchPointEnvironment,
  ): Option[ProductRatePlan[catalog.SupporterPlus.type]] =
    catalog.SupporterPlus.ratePlans
      .getOrElse(environment, Nil)
      .find(productRatePlan =>
        productRatePlan.billingPeriod == product.billingPeriod &&
          productRatePlan.productOptions == SupporterPlusV1,
      )

  def supporterPlusRatePlanV2(
      product: SupporterPlus,
      environment: TouchPointEnvironment,
  ): Option[ProductRatePlan[catalog.SupporterPlus.type]] =
    catalog.SupporterPlus.ratePlans
      .getOrElse(environment, Nil)
      .find(productRatePlan =>
        productRatePlan.billingPeriod == product.billingPeriod &&
          productRatePlan.productOptions == SupporterPlusV2,
      )

  def paperRatePlan(product: Paper, environment: TouchPointEnvironment): Option[ProductRatePlan[catalog.Paper.type]] =
    catalog.Paper.ratePlans
      .getOrElse(environment, Nil)
      .find(productRatePlan =>
        productRatePlan.productOptions == product.productOptions &&
          productRatePlan.fulfilmentOptions == product.fulfilmentOptions,
      )

}
