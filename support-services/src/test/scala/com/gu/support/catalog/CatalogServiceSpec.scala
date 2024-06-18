package com.gu.support.catalog

import com.gu.i18n.Currency.{GBP, USD}
import com.gu.support.workers.{Annual, BillingPeriod, Monthly, Quarterly}
import io.circe.parser._
import CatalogServiceSpec.serviceWithFixtures
import com.gu.i18n.Currency
import com.gu.support.config.TouchPointEnvironments.PROD
import io.circe.Json
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.util.{Success, Try}

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
      priceList <- serviceWithFixtures.getPriceList(productRatePlan.id)
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
    ) shouldBe Some(Price(14.99, GBP))

    getPrice(
      Paper,
      GBP,
      Monthly,
      HomeDelivery,
      Everyday,
    ) shouldBe Some(Price(83.99, GBP))

    getPrice(
      Paper,
      GBP,
      Monthly,
      HomeDelivery,
      Sixday,
    ) shouldBe Some(Price(73.99, GBP))

    getPrice(
      GuardianWeekly,
      GBP,
      Quarterly,
      Domestic,
      NoProductOptions,
    ) shouldBe Some(Price(45, GBP))

    getPrice(
      GuardianWeekly,
      USD,
      Annual,
      RestOfWorld,
      NoProductOptions,
    ) shouldBe Some(Price(396, USD))

    (for {
      voucherEveryday <- Paper.getProductRatePlan(PROD, Monthly, Collection, Everyday)
      priceList <- serviceWithFixtures.getPriceList(voucherEveryday.id)
    } yield priceList.savingVsRetail shouldBe Some(30)).getOrElse(fail())

  }
}

class SimpleJsonProvider(json: Json) extends CatalogJsonProvider {
  override def get: Try[Json] = Success(json)
}

object CatalogServiceSpec {
  private val json = parse(ServiceFixtures.loadCatalog).right.get
  private val jsonProvider = new SimpleJsonProvider(json)
  val serviceWithFixtures = new CatalogService(PROD, jsonProvider)
}
