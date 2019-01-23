package com.gu.support.pricing

import com.gu.i18n.Country.UK
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog._
import com.gu.support.promotions.PromotionServiceSpec
import com.gu.support.workers.{Monthly, Quarterly}
import org.scalatest.{FlatSpec, Matchers}



class ProductPriceServiceSpec extends FlatSpec with Matchers {

  "ProductPriceService" should "return prices" in {

    val catalogService = new ProductPriceService(PromotionServiceSpec.serviceWithFixtures, CatalogServiceSpec.serviceWithFixtures)


    val paper = catalogService.getPrices(Paper, UK, Some("DISCOUNT_CODE"))
    paper(HomeDelivery)(Sixday)(Monthly).find(_.currency == GBP).map(_.price) shouldBe Some(54.12)

    val guardianWeekly = catalogService.getPrices(GuardianWeekly, UK, Some("DISCOUNT_CODE"))
    guardianWeekly(Domestic)(NoProductOptions)(Quarterly).find(_.currency == GBP).map(_.price) shouldBe Some(37.50)

    val digitalPack = catalogService.getPrices(DigitalPack, UK, Some("DISCOUNT_CODE"))
    digitalPack(NoFulfilmentOptions)(NoProductOptions)(Monthly).find(_.currency == GBP).map(_.price) shouldBe Some(11.99)
  }
}
