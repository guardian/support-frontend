package com.gu.support.catalog

import com.gu.i18n.Currency.{GBP, USD}
import com.gu.support.workers.{Annual, Monthly, Quarterly}
import io.circe.parser._
import CatalogServiceSpec.serviceWithFixtures
import com.gu.support.config.TouchPointEnvironments.PROD
import ophan.thrift.event.PrintProduct.VoucherEveryday
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers


class CatalogServiceSpec extends AsyncFlatSpec with Matchers {

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

    (for {
      voucherEveryday <- Paper.getProductRatePlan(PROD, Monthly, Collection, Everyday)
      priceList <- serviceWithFixtures.getPriceList(voucherEveryday)
    } yield priceList.saving shouldBe 31).getOrElse(fail())

  }
}

object CatalogServiceSpec{
  private val json = parse(ServiceFixtures.loadCatalog).right.get
  private val jsonProvider = new SimpleJsonProvider(json)
  val serviceWithFixtures = new CatalogService(PROD, jsonProvider)
}

