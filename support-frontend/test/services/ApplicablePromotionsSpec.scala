package services

import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.promotions.{AppliesToCatalogInformation, CatalogRatePlan, PromoWithCatalogInformation}
import org.joda.time.DateTime
import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec

class ApplicablePromotionsSpec extends AnyWordSpec with Matchers {

  private val now = new DateTime(2026, 6, 1, 12, 0)

  private def promotion(
      promoCode: String,
      countries: Set[Country] = Set(Country.UK),
      catalogRatePlans: List[CatalogRatePlan] = List(CatalogRatePlan("GuardianWeeklyDomestic", "MonthlyPlus")),
      startTimestamp: DateTime = now.minusDays(1),
      endTimestamp: Option[DateTime] = None,
  ) = PromoWithCatalogInformation(
    promoCode = promoCode,
    name = "Test promo",
    campaignCode = "TEST_CAMPAIGN",
    appliesTo = AppliesToCatalogInformation(productRatePlanIds = Set.empty, countries, catalogRatePlans),
    startTimestamp = startTimestamp,
    endTimestamp = endTimestamp,
    discount = None,
    description = None,
    landingPage = None,
    isIntroductoryPricing = None,
  )

  private def applicableCodes(
      promotions: Seq[PromoWithCatalogInformation],
      countryGroup: CountryGroup = CountryGroup.UK,
      isGift: Boolean = false,
  ) =
    ApplicablePromotions.filter(promotions, Set("GuardianWeeklyDomestic"), isGift, countryGroup, now).map(_.promoCode)

  private val giftOnly =
    promotion("GIFTONLY", catalogRatePlans = List(CatalogRatePlan("GuardianWeeklyDomestic", "OneYearGift")))

  "ApplicablePromotions.filter" should {
    "keep promotions which are active, available in the country group and apply to one of the products" in {
      applicableCodes(Seq(promotion("VALID"))) shouldBe Seq("VALID")
    }

    "exclude promotions which haven't started yet" in {
      applicableCodes(Seq(promotion("FUTURE", startTimestamp = now.plusMinutes(1)))) shouldBe empty
    }

    "exclude promotions which have expired, including those expiring exactly now" in {
      applicableCodes(
        Seq(
          promotion("EXPIRED", endTimestamp = Some(now.minusMinutes(1))),
          promotion("EXPIRESNOW", endTimestamp = Some(now)),
        ),
      ) shouldBe empty
    }

    "include promotions which haven't expired yet" in {
      applicableCodes(Seq(promotion("NOTEXPIRED", endTimestamp = Some(now.plusMinutes(1))))) shouldBe Seq("NOTEXPIRED")
    }

    "exclude promotions not available in any country in the country group" in {
      applicableCodes(Seq(promotion("USONLY", countries = Set(Country.US)))) shouldBe empty
    }

    "include promotions available in at least one country in the country group" in {
      val promo = promotion("SOMEEUROPE", countries = Set(Country.US, Country("FR", "France")))
      applicableCodes(Seq(promo), CountryGroup.Europe) shouldBe Seq("SOMEEUROPE")
    }

    "exclude promotions which don't apply to any of the products" in {
      val promo = promotion("PAPERONLY", catalogRatePlans = List(CatalogRatePlan("HomeDelivery", "Everyday")))
      applicableCodes(Seq(promo)) shouldBe empty
    }

    "include promotions which apply to at least one of the products" in {
      val promo = promotion(
        "MIXED",
        catalogRatePlans = List(
          CatalogRatePlan("HomeDelivery", "Everyday"),
          CatalogRatePlan("GuardianWeeklyDomestic", "AnnualPlus"),
        ),
      )
      applicableCodes(Seq(promo)) shouldBe Seq("MIXED")
    }

    "exclude promotions which only apply to gift rate plans when not filtering for gifts" in {
      applicableCodes(Seq(giftOnly)) shouldBe empty
    }

    "include promotions which apply to a gift rate plan when filtering for gifts" in {
      applicableCodes(Seq(giftOnly), isGift = true) shouldBe Seq("GIFTONLY")
    }

    "exclude promotions which only apply to non-gift rate plans when filtering for gifts" in {
      applicableCodes(Seq(promotion("NONGIFT")), isGift = true) shouldBe empty
    }
  }

  "ApplicablePromotions.filterByCountryGroup" should {
    def codesByCountryGroup(
        promotions: Seq[PromoWithCatalogInformation],
        countryGroup: CountryGroup = CountryGroup.UK,
    ) =
      ApplicablePromotions.filterByCountryGroup(promotions, countryGroup, now).map(_.promoCode)

    "keep active promotions available in the country group, for any product, gift or not" in {
      val paper = promotion("PAPER", catalogRatePlans = List(CatalogRatePlan("HomeDelivery", "Everyday")))
      codesByCountryGroup(Seq(promotion("WEEKLY"), giftOnly, paper)) shouldBe Seq("WEEKLY", "GIFTONLY", "PAPER")
    }

    "exclude promotions which haven't started yet or have expired" in {
      codesByCountryGroup(
        Seq(
          promotion("FUTURE", startTimestamp = now.plusMinutes(1)),
          promotion("EXPIRED", endTimestamp = Some(now.minusMinutes(1))),
        ),
      ) shouldBe empty
    }

    "exclude promotions not available in any country in the country group" in {
      codesByCountryGroup(Seq(promotion("UKONLY")), CountryGroup.US) shouldBe empty
    }
  }
}
