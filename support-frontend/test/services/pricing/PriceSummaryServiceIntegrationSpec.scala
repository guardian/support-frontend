package services.pricing

import org.apache.pekko.actor.ActorSystem
import com.gu.aws.AwsS3Client
import com.gu.i18n.{CountryGroup, Currency}
import com.gu.i18n.CountryGroup.{Australia, Canada, Europe, NewZealand, RestOfTheWorld, UK, US}
import com.gu.i18n.Currency.{AUD, CAD, EUR, GBP, NZD, USD}
import com.gu.support.catalog._
import com.gu.support.config.{Stages, TouchPointEnvironments}
import com.gu.support.promotions.PromotionServiceSpec
import com.gu.support.workers.{Annual, BillingPeriod, Monthly, Quarterly}
import com.gu.support.zuora.api.ReaderType.Gift
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

case class PromoTestData(
    promoCode: String,
    countryGroup: CountryGroup,
    billingPeriod: BillingPeriod,
    currency: Currency,
)
object PromoTestData {
  val t3Promos = List(
    PromoTestData("TIER3_UK_MONTHLY", UK, Monthly, GBP),
    PromoTestData("TIER3_UK_ANNUAL", UK, Annual, GBP),
    PromoTestData("TIER3_US_MONTHLY", US, Monthly, USD),
    PromoTestData("TIER3_US_ANNUAL", US, Annual, USD),
    PromoTestData("TIER3_AU_MONTHLY", Australia, Monthly, AUD),
    PromoTestData("TIER3_AU_ANNUAL", Australia, Annual, AUD),
    PromoTestData("TIER3_CA_MONTHLY", Canada, Monthly, CAD),
    PromoTestData("TIER3_CA_ANNUAL", Canada, Annual, CAD),
    PromoTestData("TIER3_EU_MONTHLY", Europe, Monthly, EUR),
    PromoTestData("TIER3_EU_ANNUAL", Europe, Annual, EUR),
    PromoTestData("TIER3_NZ_MONTHLY", NewZealand, Monthly, NZD),
    PromoTestData("TIER3_NZ_ANNUAL", NewZealand, Annual, NZD),
    PromoTestData("TIER3_INT_MONTHLY", RestOfTheWorld, Monthly, USD),
    PromoTestData("TIER3_INT_ANNUAL", RestOfTheWorld, Annual, USD),
  )
}

@IntegrationTest
class PriceSummaryServiceIntegrationSpec extends AsyncFlatSpec with Matchers with LazyLogging {
  val actorSystem = ActorSystem("test")
  val defaultPromotionsService = new DefaultPromotionServiceS3(AwsS3Client, Stages.DEV, actorSystem)
  val service =
    new PriceSummaryService(
      PromotionServiceSpec.serviceWithDynamo,
      defaultPromotionsService,
      CatalogService(TouchPointEnvironments.CODE),
    )

  "PriceSummaryService" should "return prices" in {
    val result = service.getPrices(GuardianWeekly, List("WJW7OAJ3A"))
    result.size shouldBe 7
    result(UK)(Domestic)(NoProductOptions).size shouldBe 4
  }

  "PriceSummaryService" should "should not return any Tier Three promotions in the Supporter Plus pricing" in {
    val failures = PromoTestData.t3Promos.filter(promo => {
      import promo._
      val result = service.getPrices(SupporterPlus, List(promo.promoCode))
      result(countryGroup)(NoFulfilmentOptions)(NoProductOptions)(billingPeriod)(currency).promotions.nonEmpty
    })
    failures.size shouldBe 0
  }

  it should "return gift prices" in {
    val gift = service.getPrices(GuardianWeekly, Nil, Gift)
    gift.size shouldBe 7
    gift(US)(RestOfWorld)(NoProductOptions).size shouldBe 2 // Annual and three month
    gift(US)(RestOfWorld)(NoProductOptions).find(_._1 == Annual) shouldBe defined
    gift(US)(RestOfWorld)(NoProductOptions).find(_._1 == Quarterly) shouldBe defined
  }
}
