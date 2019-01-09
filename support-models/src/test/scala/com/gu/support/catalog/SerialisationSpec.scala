package com.gu.support.catalog

import com.gu.support.SerialisationTestHelpers
import com.gu.support.encoding.CustomCodecs.decodeCurrency
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.FlatSpec

class SerialisationSpec extends FlatSpec with SerialisationTestHelpers with LazyLogging {

  "ProductRatePlan" should "decode successfully" in {
    testDecoding[ProductRatePlan](Fixtures.digitalPackJson)
  }

  "Digital Pack Catalog" should "decode successfully" in {
    testDecoding[Catalog](Fixtures.loadMinCatalog,
      catalog => {
        catalog.products.length shouldBe 1
        val digitalPack = catalog.products.head
        digitalPack.productRatePlans.length shouldBe 3
        digitalPack.productRatePlans.head.prices.length shouldBe 6
        digitalPack.productRatePlans.head.id shouldBe "2c92a0fb4edd70c8014edeaa4eae220a"
      })
  }

  "The full Catalog" should "decode successfully" in {
    testDecoding[Catalog](Fixtures.loadCatalog,
      catalog => {
        catalog.products.length shouldBe 2
      })
  }
}



