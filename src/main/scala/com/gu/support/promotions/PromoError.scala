package com.gu.support.promotions

sealed trait PromoError {
  def msg: String
}

case object InvalidCountry extends PromoError {
  override val msg = "The promo code you supplied is not applicable in this country"
}

case object InvalidProductRatePlan extends PromoError {
  override val msg = "The promo code you supplied is not applicable for this product"
}

case object NotApplicable extends PromoError {
  override  val msg = "This promotion is not applicable"
}

case object NoSuchCode extends PromoError {
  override  val msg = "Unknown or expired promo code"
}

case object ExpiredPromotion extends PromoError {
  override val msg = "The promo code you supplied has expired"
}

case object PromotionNotActiveYet extends PromoError {
  override val msg = "The promo code you supplied is not active yet"
}
