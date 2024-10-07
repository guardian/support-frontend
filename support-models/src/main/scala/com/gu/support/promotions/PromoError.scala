package com.gu.support.promotions

sealed trait PromoError {
  def msg: String
}

case object InvalidCountry extends PromoError {
  override val msg: String = "The promo code you supplied is not applicable in this country"
}

case object InvalidProductRatePlan extends PromoError {
  override val msg: String = "The promo code you supplied is not applicable for this product"
}

case object NotApplicable extends PromoError {
  override val msg: String = "This promotion is not applicable"
}

case object NoSuchCode extends PromoError {
  override val msg: String = "Unknown or expired promo code"
}

case class DuplicateCode(debug: String) extends PromoError {
  override val msg: String = s"Duplicate promo codes: $debug"
}

case object ExpiredPromotion extends PromoError {
  override val msg: String = "The promo code you supplied has expired"
}

case object PromotionNotActiveYet extends PromoError {
  override val msg: String = "The promo code you supplied is not active yet"
}
