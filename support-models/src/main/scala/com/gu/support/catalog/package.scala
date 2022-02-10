package com.gu.support

import io.circe.generic.auto._

package object catalog {

  // The rate plan for a particular product
  type ProductRatePlanId = String

  // case class ProductId(value: String) extends AnyVal
  type ProductId = String

  type ProductRatePlanChargeId = String

}
