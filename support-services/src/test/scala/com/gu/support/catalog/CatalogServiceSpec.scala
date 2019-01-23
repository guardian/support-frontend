package com.gu.support.catalog

import com.gu.i18n.Currency.{GBP, USD}
import com.gu.support.workers.{Annual, Monthly, Quarterly}
import io.circe.parser._
import org.scalatest.{FlatSpec, Matchers}
import CatalogServiceSpec.serviceWithFixtures

class CatalogServiceSpec extends FlatSpec with Matchers {

  "CatalogService" should "load the catalog" in {
    serviceWithFixtures.getPrice(
      DigitalPack,
      GBP,
      Monthly,
      NoFulfilmentOptions,
      NoProductOptions
    ) shouldBe Some(Price(11.99, GBP))

    serviceWithFixtures.getPrice(
      Paper,
      GBP,
      Monthly,
      HomeDelivery,
      Everyday
    ) shouldBe Some(Price(62.79, GBP))

    serviceWithFixtures.getPrice(
      Paper,
      GBP,
      Monthly,
      HomeDelivery,
      Sixday
    ) shouldBe Some(Price(54.12, GBP))

    serviceWithFixtures.getPrice(
      GuardianWeekly,
      GBP,
      Quarterly,
      Domestic,
      NoProductOptions
    ) shouldBe Some(Price(37.50, GBP))

    serviceWithFixtures.getPrice(
      GuardianWeekly,
      USD,
      Annual,
      RestOfWorld,
      NoProductOptions
    ) shouldBe Some(Price(325.20, USD))
  }
}

object CatalogServiceSpec{
  private val json = parse(Fixtures.loadCatalog).right.get
  private val jsonProvider = new SimpleJsonProvider(json)
  val serviceWithFixtures = new CatalogService(jsonProvider)
}

