package com.gu.support.catalog

import com.gu.support.SerialisationTestHelpers
import com.gu.support.encoding.CustomCodecs.decodeCurrency
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.FlatSpec

class SerialisationSpec extends FlatSpec with SerialisationTestHelpers with LazyLogging {

  "The full Catalog" should "decode successfully" in {
    testDecoding[Catalog](Fixtures.loadCatalog,
      catalog => {
        catalog.prices.length shouldBe Catalog.productRatePlansWithPrices.length
      })
  }
}



