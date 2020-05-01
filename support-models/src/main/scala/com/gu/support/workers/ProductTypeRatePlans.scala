package com.gu.support.workers

import com.gu.support.catalog.{Product, ProductRatePlan}
import com.gu.support.config.TouchPointEnvironment


trait ProductTypeRatePlans[P] {
  def productRatePlan(product: P, environment: TouchPointEnvironment, fixedTerm: Boolean): Option[ProductRatePlan[Product]]
}

object ProductTypeRatePlans {

  def apply[P](implicit p: ProductTypeRatePlans[P]): ProductTypeRatePlans[P] = p

  def productRatePlan[P: ProductTypeRatePlans](p: P, environment: TouchPointEnvironment, fixedTerm: Boolean): Option[ProductRatePlan[Product]] =
    ProductTypeRatePlans[P].productRatePlan(p, environment, fixedTerm)

  implicit class Ops[P: ProductTypeRatePlans](p: P) {
    def productRatePlan(environment: TouchPointEnvironment, fixedTerm: Boolean): Option[ProductRatePlan[Product]] =
      ProductTypeRatePlans[P].productRatePlan(p, environment, fixedTerm)
  }

  implicit val productTypeRatePlan: ProductTypeRatePlans[ProductType] = (product: ProductType, environment: TouchPointEnvironment, fixedTerm: Boolean) =>
    product match {
      case d: DigitalPack => d.productRatePlan(environment, fixedTerm)
      case p: Paper => p.productRatePlan(environment, fixedTerm)
      case w: GuardianWeekly => w.productRatePlan(environment, fixedTerm)
      case _ => None
    }

  implicit val weeklyRatePlan: ProductTypeRatePlans[GuardianWeekly] = (product: GuardianWeekly, environment: TouchPointEnvironment, fixedTerm) => {
    val postIntroductoryBillingPeriod = if (product.billingPeriod == SixWeekly) Quarterly else product.billingPeriod
    product.catalogType.ratePlans.getOrElse(environment, Nil).find(productRatePlan =>
      productRatePlan.fulfilmentOptions == product.fulfilmentOptions &&
        productRatePlan.billingPeriod == postIntroductoryBillingPeriod &&
      productRatePlan.fixedTerm == fixedTerm
    )
  }

  implicit val digitalRatePlan: ProductTypeRatePlans[DigitalPack] = (product: DigitalPack, environment: TouchPointEnvironment, fixedTerm) =>
    product.catalogType.ratePlans.getOrElse(environment, Nil).find(productRatePlan =>
      productRatePlan.billingPeriod == product.billingPeriod &&
      productRatePlan.productOptions == product.productOptions
    )

  implicit val paperRatePlan: ProductTypeRatePlans[Paper] = (product: Paper, environment: TouchPointEnvironment, fixedTerm) =>
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


