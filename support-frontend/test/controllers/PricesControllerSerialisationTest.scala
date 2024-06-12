package controllers

import com.gu.i18n.Currency
import com.gu.support.promotions.{
  DiscountBenefit,
  FreeTrialBenefit,
  IntroductoryPeriodType,
  IntroductoryPriceBenefit,
  Issue,
}
import controllers.PricesController.{CountryGroupPriceData, Prices, ProductPriceData, RatePlanPriceData}
import org.joda.time.{DateTime, Days}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import services.pricing.{PriceSummary, PromotionSummary}

import scala.concurrent.duration.DurationInt
import io.circe.syntax._

class PricesControllerSerialisationTest extends AnyFlatSpec with Matchers {

  it should "serialise a sample prices payload" in {
    val promotionSummary = PromotionSummary(
      "promo",
      "desc",
      "proCode",
      Some(BigDecimal(1.1)),
      Some(3),
      None,
      Some(FreeTrialBenefit(Days.SEVEN)),
      None,
      Some(IntroductoryPriceBenefit(0.5, 3, Issue)),
      None,
      new DateTime("2020-01-01"),
      None,
    )
    val priceSummary = PriceSummary(BigDecimal(1.2), Some(50), Currency.GBP, false, List(promotionSummary))
    val ratePlanPriceData = RatePlanPriceData("pr", "cur", Some(priceSummary))
    val productPriceData = ProductPriceData(ratePlanPriceData, ratePlanPriceData)
    val countryGroupPriceData = CountryGroupPriceData(Some(productPriceData), Some(productPriceData))
    val prices =
      Prices(
        countryGroupPriceData,
        countryGroupPriceData,
        countryGroupPriceData,
        countryGroupPriceData,
        countryGroupPriceData,
        countryGroupPriceData,
        countryGroupPriceData,
      )
    val actual = prices.asJson.spaces2
    withClue(actual) {
      actual.length should be >= 24200 // 24259
    }
  }

}
