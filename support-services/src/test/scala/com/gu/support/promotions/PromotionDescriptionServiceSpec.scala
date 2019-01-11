package com.gu.support.promotions

import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.Price
import org.joda.time.Months
import org.scalatest.{FlatSpec, Matchers}

class PromotionDescriptionServiceSpec extends FlatSpec with Matchers {

  "PromotionDescriptionService" should "work out a discount correctly" in {
    val discountBenefit = DiscountBenefit(25, Some(Months.TWELVE))
    //TODO: lots more tests here
    PromotionDescriptionService.getDiscountedPrice(Price(47.62, GBP), discountBenefit).value shouldBe 35.71
  }

}
