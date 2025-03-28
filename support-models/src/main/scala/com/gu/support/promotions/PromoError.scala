package com.gu.support.promotions

sealed trait PromoError {
  def msg: String
}

case object InvalidCountryGroup extends PromoError {
  override val msg = "The promo code you supplied is not applicable in this region"
}

case object InvalidProductRatePlan extends PromoError {
  override val msg = "The promo code you supplied is not applicable for this product"
}

case object NotApplicable extends PromoError {
  override val msg = "This promotion is not applicable"
}

case object NoSuchCode extends PromoError {
  override val msg = "Unknown or expired promo code"
}

case class DuplicateCode(debug: String) extends PromoError {
  override val msg = s"Duplicate promo codes: $debug"
}

case object ExpiredPromotion extends PromoError {
  override val msg = "The promo code you supplied has expired"
}

case object PromotionNotActiveYet extends PromoError {
  override val msg = "The promo code you supplied is not active yet"
}
