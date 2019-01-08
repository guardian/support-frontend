package com.gu.support.catalog

import com.gu.i18n.Currency.GBP

case class ProductRatePlan(
  id: String,
  status: Status,
  name: Option[String],
  productRatePlanCharges: List[ProductRatePlanCharge]
) {
  def price: BigDecimal = {
    productRatePlanCharges
      .filter(_.endDateCondition.contains("Subscription_End"))
      .map(
        _.pricing
          .filter(_.currency == GBP)
          .map(_.price).sum
      ).sum
  }
}

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object ProductRatePlan {
  implicit val codec: Codec[ProductRatePlan] = deriveCodec
}
