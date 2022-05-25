package controllers

import com.gu.i18n.CountryGroup
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.{Domestic, NoProductOptions}
import services.pricing.{PriceSummary, ProductPrices, PromotionSummary}
import com.gu.support.promotions.{DiscountBenefit, PromotionCopy}
import com.gu.support.workers.{Annual, Monthly}
import controllers.PricesController.{ProductPriceData, RatePlanPriceData}
import org.joda.time.Months
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class PricesControllerTest extends AnyWordSpec with Matchers {

  val guardianWeeklyProductPrices: ProductPrices = Map(
    CountryGroup.UK ->
      Map(
        Domestic ->
          Map(
            NoProductOptions ->
              Map(
                Monthly ->
                  Map(
                    GBP -> PriceSummary(
                      price = 12.5,
                      savingVsRetail = None,
                      currency = GBP,
                      fixedTerm = false,
                      promotions = List(
                        PromotionSummary(
                          "Jan 22 - GW Discount Campaign",
                          "Save 50% for 3 months",
                          "GWJAN22SALE",
                          Some(6.25),
                          Some(3),
                          Some(DiscountBenefit(50.0, Some(Months.THREE))),
                          None,
                          None,
                          None,
                          Some(
                            PromotionCopy(
                              Some("Find clarity with the Guardian's global magazine"),
                              None,
                              Some("50% off for 3 months"),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                Annual ->
                  Map(
                    GBP -> PriceSummary(
                      price = 150,
                      savingVsRetail = None,
                      currency = GBP,
                      fixedTerm = false,
                      promotions = List(
                        PromotionSummary(
                          "10% Off Annual Guardian Weekly Subs",
                          "Subscribe for 12 months and save 10%",
                          "10ANNUAL",
                          Some(135.00),
                          Some(1),
                          Some(DiscountBenefit(10.0, Some(Months.TWELVE))),
                          None,
                          None,
                          None,
                          Some(PromotionCopy(None, None, Some("Subscribe for 12 months and save 10%"))),
                        ),
                      ),
                    ),
                  ),
              ),
          ),
      ),
  )

  "PricesControllerTest" should {
    "transform ProductPrices" in {
      val expected = ProductPriceData(
        Monthly = RatePlanPriceData(
          price = "6.25",
        ),
        Annual = RatePlanPriceData(
          price = "135.0",
        ),
      )

      val result = PricesController.buildProductPriceData(
        guardianWeeklyProductPrices,
        CountryGroup.UK,
        GBP,
        Domestic,
      )

      result mustEqual (Some(expected))
    }
  }
}
