package com.gu.support.pricing

import com.gu.i18n.CountryGroup.UK
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog._
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.{DiscountBenefit, PromotionServiceSpec}
import com.gu.support.workers.{Annual, Monthly, Quarterly}
import org.joda.time.Months
import org.scalatest.{FlatSpec, Matchers}

class PriceSummaryServiceSpec extends FlatSpec with Matchers {

  "PriceSummaryService" should "return prices" in {

    val catalogService = new PriceSummaryService(PromotionServiceSpec.serviceWithFixtures, CatalogServiceSpec.serviceWithFixtures)

    val paper = catalogService.getPrices(Paper, Some("DISCOUNT_CODE"))
    paper(UK)(HomeDelivery)(Sixday)(Monthly).find(_.currency == GBP).map(_.price) shouldBe Some(54.12)

    val guardianWeekly = catalogService.getPrices(GuardianWeekly, Some("DISCOUNT_CODE"))
    guardianWeekly(UK)(Domestic)(NoProductOptions)(Quarterly)(GBP).map(_.price) shouldBe Some(37.50)
    guardianWeekly(UK)(Domestic)(NoProductOptions)(Annual)(GBP).flatMap(_.promotion.flatMap(_.discountedPrice)) shouldBe Some(105)

    val digitalPack = catalogService.getPrices(DigitalPack, Some("DISCOUNT_CODE"))
    val priceSummary = digitalPack(UK)(NoFulfilmentOptions)(NoProductOptions)(Monthly)(GBP).get
    priceSummary.price shouldBe 11.99
    priceSummary.promotion.get.discountedPrice shouldBe Some(8.39)
  }

  it should "work out a discount correctly" in {
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
    PriceSummaryService.getDiscountedPrice(Price(original, GBP), discount).value shouldBe expected
}
