package com.gu.support.promotions

import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.Price
import org.joda.time.Months
import org.scalatest.{FlatSpec, Matchers}

class PromotionDescriptionServiceSpec extends FlatSpec with Matchers {

  "PromotionDescriptionService" should "work out a discount correctly" in {
    val discountBenefit = DiscountBenefit(25, Some(Months.TWELVE))
    // TODO: It seems that Paper & Paper+ round discounts differently on the
    // current subscribe site. For instance Everyday and Sixday+ have the same
    // original price but different discounted values - £35.71 & £35.72.
    // We need to work out what they will actually get charged by Zuora

    checkPrice(discountBenefit, 47.62, 35.71) //Everyday
    checkPrice(discountBenefit, 51.96, 38.97) //Everyday+
    checkPrice(discountBenefit, 41.12, 30.84) //Sixday
    //checkPrice(discountBenefit, 47.62, 35.72) //Sixday+
    checkPrice(discountBenefit, 20.76, 15.57) //Weekend
    //checkPrice(discountBenefit, 29.42, 22.07) //Weekend+
    checkPrice(discountBenefit, 10.79, 8.09) //Sunday
    //checkPrice(discountBenefit, 22.06, 16.55) //Sunday+
  }

  def checkPrice(discount: DiscountBenefit, original: BigDecimal, expected: BigDecimal) =
    PromotionDescriptionService.getDiscountedPrice(Price(original, GBP), discount).value shouldBe expected

}
