package com.gu.support.workers

import com.gu.i18n.Currency.GBP
import com.gu.support.SerialisationTestHelpers
import com.gu.support.catalog.{Collection, RestOfWorld, Sixday}
import com.gu.support.workers.ProductType._
import com.gu.support.zuora.api.ReaderType
import org.scalatest.wordspec.AnyWordSpec

class ProductTypeDecoderTest extends AnyWordSpec with SerialisationTestHelpers {

  "ProductTypeDecoder" should {

    "decode a contribution - monthly" in {
      val json = """{"productType": "Contribution", "amount": 5, "currency": "GBP", "billingPeriod": "Monthly"}"""
      val expected = Contribution(5, GBP, Monthly)
      testDecoding[Contribution](json, _ shouldBe expected)
    }

    "decode a contribution - annual" in {
      val json = """{"productType": "Contribution", "amount": 5, "currency": "GBP", "billingPeriod": "Annual"}"""
      val expected = Contribution(5, GBP, Annual)
      testDecoding[Contribution](json, _ shouldBe expected)
    }

    "decode a paper sub" in {
      val json =
        """
          |{
          |  "billingPeriod": "Monthly",
          |  "currency": "GBP",
          |  "fulfilmentOptions": "Collection",
          |  "productOptions": "Sixday",
          |  "productType": "Paper"
          |}
        """.stripMargin

      testDecoding[Paper](
        json,
        _ shouldBe Paper(GBP, Monthly, Collection, Sixday),
      )
    }

    "decode a Guardian Weekly sub" in {
      val json =
        """
          |{
          |  "billingPeriod": "Quarterly",
          |  "currency": "GBP",
          |  "fulfilmentOptions": "RestOfWorld",
          |  "productType": "GuardianWeekly"
          |}
        """.stripMargin

      testDecoding[GuardianWeekly](
        json,
        _ shouldBe GuardianWeekly(GBP, Quarterly, RestOfWorld),
      )
    }

    "decode a digital pack" in {
      val json =
        """{"productType": "DigitalPack", "currency": "GBP", "billingPeriod": "Monthly", "readerType": "Direct"}"""
      val expected = DigitalPack(GBP, Monthly)
      testDecoding[DigitalPack](json, _ shouldBe expected)
    }

    "decode a digital pack - gift purchase or redemption" in {
      val json =
        """{"productType": "DigitalPack", "currency": "GBP", "billingPeriod": "Monthly", "readerType": "Gift"}"""
      val expected = DigitalPack(GBP, Monthly, ReaderType.Gift)
      testDecoding[DigitalPack](json, _ shouldBe expected)
    }

  }

}
