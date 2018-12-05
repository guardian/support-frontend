package com.gu.support.catalog

import java.time.DayOfWeek

import com.gu.support.SerialisationTestHelpers
import com.gu.support.encoding.CustomCodecs.decodeCurrency
import com.typesafe.scalalogging.LazyLogging
import io.circe.Decoder
import io.circe.generic.auto._
import io.circe.generic.semiauto.deriveDecoder
import org.scalatest.FlatSpec

class SerialisationSpec extends FlatSpec with SerialisationTestHelpers with LazyLogging {

  "ZuoraCatalog" should "decode json" in {
    testDecoding[Catalog](Fixtures.loadCatalog,
      catalog => {
        catalog.products.length shouldBe 16

        val productRatePlans = catalog.products.flatMap(_.productRatePlans)
        val statuses = productRatePlans.map(_.status).distinct

        productRatePlans.length shouldBe 122
        productRatePlans.count(_.status == Active) shouldBe 111

        val ratePlanCharges = productRatePlans.flatMap(_.productRatePlanCharges)
        val ratePlanProductTypes = ratePlanCharges.map(_.productType).distinct
        ratePlanProductTypes.length shouldBe 17
      })

  }

  "PaperDay object" should "be able to parse an id" in {
    PaperDay.fromId("Print Monday") should be(Some(PaperDay("Print Monday", DayOfWeek.MONDAY)))
    PaperDay.fromId("Invalid id") should be(None)
  }
}



