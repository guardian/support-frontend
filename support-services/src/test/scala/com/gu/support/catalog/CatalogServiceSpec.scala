package com.gu.support.catalog

import com.gu.i18n.Currency.{GBP, USD}
import com.gu.support.workers.{Annual, BillingPeriod, Monthly, Quarterly}
import io.circe.parser._
import CatalogServiceSpec.serviceWithFixtures
import com.gu.i18n.Currency
import com.gu.support.config.TouchPointEnvironments.PROD
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class CatalogServiceSpec extends AsyncFlatSpec with Matchers {

  def getPrice[T <: Product](
      product: T,
      currency: Currency,
      billingPeriod: BillingPeriod,
      fulfilmentOptions: FulfilmentOptions,
      productOptions: ProductOptions,
  ): Option[Price] = {
    for {
      productRatePlan <- product.getProductRatePlan(PROD, billingPeriod, fulfilmentOptions, productOptions)
      priceList <- serviceWithFixtures.getPriceList(productRatePlan)
      price <- priceList.prices.find(_.currency == currency)
    } yield price
  }

  "CatalogService" should "load the catalog" in {
    getPrice(
      DigitalPack,
      GBP,
      Monthly,
      NoFulfilmentOptions,
      NoProductOptions,
    ) shouldBe Some(Price(11.99, GBP))

    getPrice(
      Paper,
      GBP,
      Monthly,
      HomeDelivery,
      Everyday,
    ) shouldBe Some(Price(67.99, GBP))

    getPrice(
      Paper,
      GBP,
      Monthly,
      HomeDelivery,
      Sixday,
    ) shouldBe Some(Price(57.99, GBP))

    getPrice(
      GuardianWeekly,
      GBP,
      Quarterly,
      Domestic,
      NoProductOptions,
    ) shouldBe Some(Price(37.50, GBP))

    getPrice(
      GuardianWeekly,
      USD,
      Annual,
      RestOfWorld,
      NoProductOptions,
    ) shouldBe Some(Price(325.20, USD))

    (for {
      voucherEveryday <- Paper.getProductRatePlan(PROD, Monthly, Collection, Everyday)
      priceList <- serviceWithFixtures.getPriceList(voucherEveryday)
    } yield priceList.savingVsRetail shouldBe Some(43)).getOrElse(fail())

  }
}

object CatalogServiceSpec {
  private val json = parse(ServiceFixtures.loadCatalog).right.get
  private val jsonProvider = new SimpleJsonProvider(json)
  val serviceWithFixtures = new CatalogService(PROD, jsonProvider)
}
