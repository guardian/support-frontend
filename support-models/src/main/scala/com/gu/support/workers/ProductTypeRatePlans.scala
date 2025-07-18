package com.gu.support.workers

import com.gu.support.catalog
import com.gu.support.catalog.ProductRatePlan
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.zuora.api.ReaderType

object ProductTypeRatePlans {

  def weeklyRatePlan(
      product: GuardianWeekly,
      environment: TouchPointEnvironment,
      readerType: ReaderType,
  ): Option[ProductRatePlan[catalog.GuardianWeekly.type]] = {
    catalog.GuardianWeekly.ratePlans
      .getOrElse(environment, Nil)
      .find(productRatePlan =>
        productRatePlan.fulfilmentOptions == product.fulfilmentOptions &&
          productRatePlan.billingPeriod == product.billingPeriod &&
          productRatePlan.readerType == readerType,
      )
  }

  def digitalRatePlan(
      product: DigitalPack,
      environment: TouchPointEnvironment,
  ): Option[ProductRatePlan[catalog.DigitalPack.type]] =
    catalog.DigitalPack.ratePlans
      .getOrElse(environment, Nil)
      .find(productRatePlan => productRatePlan.billingPeriod == product.billingPeriod)

  def supporterPlusRatePlan(
      product: SupporterPlus,
      environment: TouchPointEnvironment,
  ): Option[ProductRatePlan[catalog.SupporterPlus.type]] =
    catalog.SupporterPlus.ratePlans
      .getOrElse(environment, Nil)
      .find(productRatePlan => productRatePlan.billingPeriod == product.billingPeriod)

  def guardianAdLiteRatePlan(
      product: GuardianAdLite,
      environment: TouchPointEnvironment,
  ): Option[ProductRatePlan[catalog.GuardianAdLite.type]] =
    catalog.GuardianAdLite.ratePlans
      .getOrElse(environment, Nil)
      .find(productRatePlan => productRatePlan.billingPeriod == product.billingPeriod)

  def tierThreeRatePlan(
      product: TierThree,
      environment: TouchPointEnvironment,
  ): Option[ProductRatePlan[catalog.SupporterPlus.type]] =
    catalog.TierThree.ratePlans
      .getOrElse(environment, Nil)
      .find(productRatePlan =>
        productRatePlan.billingPeriod == product.billingPeriod &&
          productRatePlan.fulfilmentOptions == product.fulfilmentOptions &&
          productRatePlan.productOptions == product.productOptions,
      )

  def paperRatePlan(product: Paper, environment: TouchPointEnvironment): Option[ProductRatePlan[catalog.Paper.type]] =
    catalog.Paper.ratePlans
      .getOrElse(environment, Nil)
      .find(productRatePlan =>
        productRatePlan.productOptions == product.productOptions &&
          productRatePlan.fulfilmentOptions == product.fulfilmentOptions,
      )

}
