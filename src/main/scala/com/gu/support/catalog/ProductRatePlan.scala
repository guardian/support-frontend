package com.gu.support.catalog

import com.gu.i18n.Currency.GBP

case class ProductRatePlan(
  id: String,
  status: Status,
  name: Option[String],
  productRatePlanCharges: List[ProductRatePlanCharge]
) {
  def price: Double = {
    productRatePlanCharges
      .filter(_.endDateCondition.contains("Subscription_End"))
      .map(
        _.pricing
          .filter(_.currency == GBP)
          .map(_.price).sum
      ).sum
  }
}
