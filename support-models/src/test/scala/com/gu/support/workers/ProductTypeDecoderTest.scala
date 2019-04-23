package com.gu.support.workers

import com.gu.i18n.Currency
import com.gu.support.SerialisationTestHelpers
import com.gu.support.catalog.{Collection, RestOfWorld, Sunday}
import com.gu.support.workers.ProductType._
import org.scalatest.WordSpec

class ProductTypeDecoderTest extends WordSpec with SerialisationTestHelpers {

  "ProductTypeDecoder" should {
    "decode a contribution" in {
      val json =
        """
          |{
          |  "amount":10,
          |  "currency":"GBP",
          |  "billingPeriod": "Monthly"
          |}
        """
          .stripMargin

      testDecoding[Contribution](json,
        contribution => {
          contribution.amount shouldBe 10
          contribution.billingPeriod shouldBe Monthly
        }
      )
    }

    "decode a paper sub" in {
      val json =
        """
          |{
          |  "currency":"GBP",
          |  "billingPeriod": "Monthly",
          |  "productOptions":"Sunday",
          |  "fulfilmentOptions": "Collection"
          |}
        """
          .stripMargin

      testDecoding[Paper](json,
        paper => {
          paper.billingPeriod shouldBe Monthly
          paper.productOptions shouldBe Sunday
          paper.fulfilmentOptions shouldBe Collection
        }
      )
    }

    "decode a Guardian Weekly sub" in {
      val json =
        """
          |{
          |  "currency":"GBP",
          |  "billingPeriod": "Annual",
          |  "fulfilmentOptions": "RestOfWorld"
          |}
        """
          .stripMargin

      testDecoding[GuardianWeekly](json,
        paper => {
          paper.billingPeriod shouldBe Annual
          paper.fulfilmentOptions shouldBe RestOfWorld
        }
      )
    }

    "decode as a digital pack if productOptions are missing" in {
      val json =
        """
          |{
          |  "currency":"GBP",
          |  "billingPeriod": "Monthly",
          |  "fulfilmentOptions": "Collection"
          |}
        """
          .stripMargin

      testDecoding[DigitalPack](json,
        digitalPack => {
          digitalPack.billingPeriod shouldBe Monthly
        }
      )
    }

    "decode as a digital pack when just billingPeriod and currency are provided" in {

      val json =
        """
          |{
          |  "currency":"USD",
          |  "billingPeriod": "Annual"
          |}
        """
          .stripMargin

      testDecoding[DigitalPack](json,
        digitalPack => {
          digitalPack.billingPeriod shouldBe Annual
          digitalPack.currency shouldBe Currency.USD
        }
      )

    }
  }

}


