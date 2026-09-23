package com.gu.support.promotions

import io.circe.parser.parse
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

//noinspection ScalaStyle
class PromoWithCatalogInformationSpec extends AnyFlatSpec with Matchers {

  private val promoJson =
    """{
      |  "promoCode": "TESTCODE",
      |  "name": "test",
      |  "campaignCode": "TEST_CAMPAIGN",
      |  "appliesTo": {
      |    "productRatePlanIds": ["rate-plan-id"],
      |    "countries": ["GB"],
      |    "catalogRatePlans": [{"productKey": "SupporterPlus", "productRatePlanKey": "Annual"}]
      |  },
      |  "startTimestamp": "2020-01-01T00:00:00.000Z",
      |  "discount": {"amount": 20, "durationMonths": 3},
      |  "description": "test description",
      |  "landingPage": {"title": "Title", "description": "Description", "roundelHtml": "50% off"}
      |}""".stripMargin

  private def decode(json: String): PromoWithCatalogInformation =
    PromoWithCatalogInformation.decoder
      .decodeJson(parse(json).getOrElse(fail("invalid test fixture json")))
      .getOrElse(fail("failed to decode PromoWithCatalogInformation"))

  "PromoWithCatalogInformation's decoder" should "decode a promotions-api response directly, with no reshaping" in {
    val promo = decode(promoJson)

    promo.promoCode shouldBe "TESTCODE"
    promo.name shouldBe "test"
    promo.campaignCode shouldBe "TEST_CAMPAIGN"
    promo.startTimestamp.toString("yyyy-MM-dd") shouldBe "2020-01-01"
    promo.endTimestamp shouldBe None
    promo.appliesTo.catalogRatePlans shouldBe List(CatalogRatePlan("SupporterPlus", "Annual"))
    promo.discount shouldBe Some(PromoDiscount(amount = 20, durationMonths = 3))
    promo.description shouldBe Some("test description")
    promo.landingPage shouldBe Some(
      PromoLandingPage(title = Some("Title"), description = Some("Description"), roundelHtml = Some("50% off")),
    )
  }

  it should "leave description as None when absent from the response, rather than defaulting it" in {
    val promo = decode("""{
      |  "promoCode": "TESTCODE",
      |  "name": "test",
      |  "campaignCode": "TEST_CAMPAIGN",
      |  "appliesTo": {"productRatePlanIds": [], "countries": ["GB"], "catalogRatePlans": []},
      |  "startTimestamp": "2020-01-01T00:00:00.000Z"
      |}""".stripMargin)

    promo.description shouldBe None
  }

  "PromoWithCatalogInformation's encoder" should
    "round-trip through decode/encode, producing JSON matching the shared TS PromoWithCatalogInformation type" in {
      val json = PromoWithCatalogInformation.encoder(decode(promoJson))

      json.hcursor.get[String]("promoCode") shouldBe Right("TESTCODE")
      json.hcursor.get[String]("startTimestamp") shouldBe Right("2020-01-01T00:00:00.000Z")
      json.hcursor.downField("discount").get[Double]("amount") shouldBe Right(20.0)
      json.hcursor.downField("discount").get[Int]("durationMonths") shouldBe Right(3)
      json.hcursor.downField("landingPage").get[String]("roundelHtml") shouldBe Right("50% off")
      json.hcursor
        .downField("appliesTo")
        .downField("catalogRatePlans")
        .downArray
        .get[String]("productKey") shouldBe Right("SupporterPlus")
    }

}
