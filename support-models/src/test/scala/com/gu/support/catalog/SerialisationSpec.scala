package com.gu.support.catalog

import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import com.gu.support.SerialisationTestHelpers
import com.gu.support.config.TouchPointEnvironments.PROD
import com.gu.support.encoding.CustomCodecs.decodeCurrency
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.Assertion
import org.scalatest.flatspec.AsyncFlatSpec

class SerialisationSpec extends AsyncFlatSpec with SerialisationTestHelpers with LazyLogging {

  "The full Catalog" should "decode successfully" in {
    val supporterPlusV1MonthlyId = "8a12865b8219d9b401822106192b64dc"
    val supporterPlusV2MonthlyId = "8a128ed885fc6ded018602296ace3eb8"
    val supporterPlusV2AnnualId = "8a128ed885fc6ded01860228f77e3d5a"
    val digitalPackId = "2c92a0fb4edd70c8014edeaa4eae220a"
    val guardianWeeklyAnnualDomesticId = "2c92a0fe6619b4b901661aa8e66c1692"
    val numberOfPriceLists =
      DigitalPack.ratePlans(PROD).length + Paper.ratePlans(PROD).length + GuardianWeekly
        .ratePlans(PROD)
        .length + SupporterPlus.ratePlans(PROD).length

    testDecoding[ZuoraCatalog](
      Fixtures.loadCatalog,
      zuoraCatalog => {
        val catalog = Catalog.convert(zuoraCatalog)
        catalog.prices.length shouldBe numberOfPriceLists
        checkPrice(catalog, supporterPlusV1MonthlyId, GBP, 10)
        checkPrice(catalog, supporterPlusV2MonthlyId, GBP, 10)
        checkPrice(catalog, supporterPlusV2AnnualId, GBP, 95)
        checkPrice(catalog, digitalPackId, GBP, 11.99)
        checkPrice(catalog, guardianWeeklyAnnualDomesticId, GBP, 165)
      },
    )
    testDecodingFailed[ZuoraCatalog](
      Fixtures.loadBadCatalog,
    )
  }

  def checkPrice(
      catalog: Catalog,
      productRatePlanId: ProductRatePlanId,
      currency: Currency,
      value: BigDecimal,
  ): Assertion = {
    catalog.prices
      .find(_.productRatePlanId == productRatePlanId)
      .getOrElse(fail(s"Couldn't find price for productRatePlanId $productRatePlanId"))
      .prices
      .find(_.currency == currency)
      .getOrElse(fail())
      .value shouldBe value
  }

  "Products" should "roundtrip successfully" in {
    testRoundTripSerialisation[Product](DigitalPack)
    testRoundTripSerialisation[Product](Paper)
  }

  "FulfilmentOptions" should "roundtrip successfully" in {
    import FulfilmentOptions.{decoder, encoder}
    testRoundTripSerialisation[FulfilmentOptions](Domestic)
  }
}
