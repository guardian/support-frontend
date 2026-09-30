package controllers

import com.gu.support.promotions.CatalogRatePlan
import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec

class PromotionsSpec extends AnyWordSpec with Matchers {

  private def ratePlan(productKey: String, productRatePlanKey: String = "Monthly") =
    CatalogRatePlan(productKey, productRatePlanKey)

  "Promotions.redirectPathForCatalogRatePlans" should {
    "redirect to the digital subscription landing page for DigitalSubscription" in {
      val path = Promotions.redirectPathForCatalogRatePlans(List(ratePlan("DigitalSubscription")))
      path shouldBe routes.Application.geoRedirectToPath("subscribe/digitaledition").url
    }

    "redirect to the (non-gift) Guardian Weekly landing page for a Guardian Weekly product key" in {
      val path = Promotions.redirectPathForCatalogRatePlans(List(ratePlan("GuardianWeeklyDomestic", "Quarterly")))
      path shouldBe routes.WeeklySubscriptionController.weeklyGeoRedirect(orderIsAGift = false).url
    }

    "redirect to the gift Guardian Weekly landing page when every matching rate plan is a gift rate plan" in {
      val path =
        Promotions.redirectPathForCatalogRatePlans(List(ratePlan("GuardianWeeklyRestOfWorld", "OneYearGift")))
      path shouldBe routes.WeeklySubscriptionController.weeklyGeoRedirect(orderIsAGift = true).url
    }

    "not treat Guardian Weekly as a gift if only some matching rate plans are gift rate plans" in {
      val path = Promotions.redirectPathForCatalogRatePlans(
        List(ratePlan("GuardianWeeklyZoneA", "OneYearGift"), ratePlan("GuardianWeeklyZoneA", "Quarterly")),
      )
      path shouldBe routes.WeeklySubscriptionController.weeklyGeoRedirect(orderIsAGift = false).url
    }

    "redirect to the paper landing page for a paper product key" in {
      val path = Promotions.redirectPathForCatalogRatePlans(List(ratePlan("HomeDelivery", "Everyday")))
      path shouldBe routes.PaperSubscriptionController.paper().url
    }

    "fall back to the contribution redirect for products not otherwise categorised (e.g. Contribution, SupporterPlus)" in {
      Promotions.redirectPathForCatalogRatePlans(
        List(ratePlan("SupporterPlus")),
      ) shouldBe routes.Application.contributeGeoRedirect("").url
      Promotions.redirectPathForCatalogRatePlans(
        List(ratePlan("Contribution", "Monthly")),
      ) shouldBe routes.Application.contributeGeoRedirect("").url
    }

    "fall back to the contribution redirect when there are no catalog rate plans at all" in {
      Promotions.redirectPathForCatalogRatePlans(Nil) shouldBe routes.Application.contributeGeoRedirect("").url
    }
  }
}
