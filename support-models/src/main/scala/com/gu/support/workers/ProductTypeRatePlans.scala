package com.gu.support.workers

import com.gu.support.catalog.{Product, ProductRatePlan}
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.Corporate


trait ProductTypeRatePlans[P] {
  def productRatePlan(product: P, environment: TouchPointEnvironment, readerType: ReaderType): Option[ProductRatePlan[Product]]
}

object ProductTypeRatePlans {

  def apply[P](implicit p: ProductTypeRatePlans[P]): ProductTypeRatePlans[P] = p

  def productRatePlan[P: ProductTypeRatePlans](p: P, environment: TouchPointEnvironment, readerType: ReaderType): Option[ProductRatePlan[Product]] =
    ProductTypeRatePlans[P].productRatePlan(p, environment, readerType)

  implicit class Ops[P: ProductTypeRatePlans](p: P) {
    def productRatePlan(environment: TouchPointEnvironment, readerType: ReaderType): Option[ProductRatePlan[Product]] =
      ProductTypeRatePlans[P].productRatePlan(p, environment, readerType)
  }

  implicit val productTypeRatePlan: ProductTypeRatePlans[ProductType] = (product: ProductType, environment: TouchPointEnvironment, readerType: ReaderType) =>
    product match {
      case d: DigitalPack => d.productRatePlan(environment, readerType)
      case p: Paper => p.productRatePlan(environment, readerType)
      case w: GuardianWeekly => w.productRatePlan(environment, readerType)
      case _ => None
    }

  implicit val weeklyRatePlan: ProductTypeRatePlans[GuardianWeekly] = (product: GuardianWeekly, environment: TouchPointEnvironment, readerType) => {
    val postIntroductoryBillingPeriod = if (product.billingPeriod == SixWeekly) Quarterly else product.billingPeriod
    product.catalogType.ratePlans.getOrElse(environment, Nil).find(productRatePlan =>
      productRatePlan.fulfilmentOptions == product.fulfilmentOptions &&
        productRatePlan.billingPeriod == postIntroductoryBillingPeriod &&
      productRatePlan.readerType == readerType
    )
  }

  implicit val digitalRatePlan: ProductTypeRatePlans[DigitalPack] = (product: DigitalPack, environment: TouchPointEnvironment, readerType) =>
    product.catalogType.ratePlans.getOrElse(environment, Nil).find(productRatePlan =>
      (productRatePlan.billingPeriod == product.billingPeriod && productRatePlan.readerType == product.readerType) ||
        (productRatePlan.readerType == Corporate && product.readerType == Corporate) // We don't care about the billing period for corporates
    )

  implicit val paperRatePlan: ProductTypeRatePlans[Paper] = (product: Paper, environment: TouchPointEnvironment, readerType) =>
    product.catalogType.ratePlans.getOrElse(environment, Nil).find(productRatePlan =>
      productRatePlan.productOptions == product.productOptions &&
        productRatePlan.fulfilmentOptions == product.fulfilmentOptions
    )

}

object GuardianWeeklyExtensions {

  implicit class IntroductoryRatePlan(val guardianWeekly: GuardianWeekly) extends AnyVal {
    /**
     * Return the productRatePlan for the introductory part of the subscription ie. 6 for 6
     */
    def introductoryRatePlan(environment: TouchPointEnvironment): Option[ProductRatePlan[Product]] =
      guardianWeekly.catalogType.ratePlans.getOrElse(environment, Nil).find(productRatePlan =>
        productRatePlan.fulfilmentOptions == guardianWeekly.fulfilmentOptions &&
          productRatePlan.billingPeriod == SixWeekly
      )
  }
}


