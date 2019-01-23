package com.gu.support.catalog

import com.gu.i18n.Currency.{GBP, USD}
import com.gu.support.config.Stages.PROD
import com.gu.support.workers.{Annual, Monthly, Quarterly}
import com.gu.test.tags.annotations.IntegrationTest
import io.circe.syntax._
import org.scalatest.{FlatSpec, Matchers}

@IntegrationTest
class CatalogServiceTest extends FlatSpec with Matchers {

  "CatalogService" should "fetch the catalog from S3" in {
    val service = CatalogService(PROD)
    service.getPrice(
      DigitalPack,
      GBP,
      Monthly,
      NoFulfilmentOptions,
      NoProductOptions
    ) shouldBe Some(Price(11.99, GBP))

    service.getPrice(
      Paper,
      GBP,
      Monthly,
      HomeDelivery,
      Everyday
    ) shouldBe Some(Price(62.79, GBP))

    service.getPrice(
      Paper,
      GBP,
      Monthly,
      HomeDelivery,
      Sixday
    ) shouldBe Some(Price(54.12, GBP))

    service.getPrice(
      GuardianWeekly,
      GBP,
      Quarterly,
      Domestic,
      NoProductOptions
    ) shouldBe Some(Price(37.50, GBP))

    service.getPrice(
      GuardianWeekly,
      USD,
      Annual,
      RestOfWorld,
      NoProductOptions
    ) shouldBe Some(Price(325.20, USD))
  }
  it should "return prices" in {
    val service = CatalogService(PROD)
    val paper = service.getPrices(Paper)
    paper(HomeDelivery)(Sixday)(Monthly).find(_.currency == GBP).map(_.value) shouldBe Some(54.12)

    val guardianWeekly = service.getPrices(GuardianWeekly)
    guardianWeekly(Domestic)(NoProductOptions)(Quarterly).find(_.currency == GBP).map(_.value) shouldBe Some(37.50)

    val digitalPack = service.getPrices(DigitalPack)
    digitalPack(NoFulfilmentOptions)(NoProductOptions)(Monthly).find(_.currency == GBP).map(_.value) shouldBe Some(11.99)
  }
}
