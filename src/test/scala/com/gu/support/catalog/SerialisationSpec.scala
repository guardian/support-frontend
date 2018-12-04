package com.gu.support.catalog

import java.time.DayOfWeek

import com.gu.support.SerialisationTestHelpers
import com.typesafe.scalalogging.LazyLogging
import io.circe.Decoder
import io.circe.generic.auto._
import io.circe.generic.semiauto.deriveDecoder
import com.gu.support.encoding.CustomCodecs.decodeCurrency
import io.circe.parser.parse
import org.scalatest.FlatSpec

class SerialisationSpec extends FlatSpec with SerialisationTestHelpers with LazyLogging {

  "ZuoraCatalog" should "decode json" in {
    val parsedJson = parse(Fixtures.loadCatalog).toOption.get
    val decoded = parsedJson.as[Catalog]

    assertDecodingSucceeded(decoded)

    val catalog = decoded.toOption.get

    //catalog.products.length shouldBe 16

    val productRatePlans = catalog.products.flatMap(_.productRatePlans)
    val statuses = productRatePlans.map(_.status).distinct

    val allRatePlans = productRatePlans.length
    val activeRatePlans = productRatePlans.filter(_.status == Active)

    val ratePlanCharges = productRatePlans.flatMap(_.productRatePlanCharges)
    val ratePlanProductTypes = ratePlanCharges.map(_.productType)
    ratePlanProductTypes.foreach(r => r.foreach(s => logger.info(s"$s")))


    true shouldBe true
  }

  "PaperDay object" should "be able to parse an id" in {
    PaperDay.fromId("Print Monday") should be(Some(PaperDay("Print Monday", DayOfWeek.MONDAY)))
    PaperDay.fromId("Invalid id") should be(None)
  }

  "ProductRatePlanChargeType" should "be decodable" in {
    testDecoding[TestClass]("""{"chargeType": "Digital Pack"}""")
  }

  implicit val decoder: Decoder[TestClass] = deriveDecoder
  case class TestClass(chargeType: Option[ProductRatePlanChargeType])
}



