package codecs

import com.gu.i18n.Currency
import com.gu.support.catalog.{Collection, Sunday}
import com.gu.support.workers.ProductType._
import com.gu.support.workers._
import io.circe.parser.parse
import org.scalatest.{MustMatchers, WordSpec}

class ProductTypeDecoderTest extends WordSpec with MustMatchers {

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

      val parsedJson = parse(json).toOption.get

      val productType: ProductType = decodeProduct.decodeJson(parsedJson).right.get

      val contributionMaybe = productType match {
        case c: Contribution => Some(c)
        case _ => None
      }

      contributionMaybe.get.amount mustBe 10
      contributionMaybe.get.billingPeriod mustBe Monthly
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

      val parsedJson = parse(json).toOption.get

      val productType: ProductType = decodeProduct.decodeJson(parsedJson).right.get

      val paperMaybe = productType match {
        case p: Paper => Some(p)
        case _ => None
      }

      paperMaybe.get.billingPeriod mustBe Monthly
      paperMaybe.get.productOptions mustBe Sunday
      paperMaybe.get.fulfilmentOptions mustBe Collection
    }
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

    val parsedJson = parse(json).toOption.get

    val productType: ProductType = decodeProduct.decodeJson(parsedJson).right.get

    productType.isInstanceOf[DigitalPack] mustBe true
    productType.billingPeriod mustBe Monthly
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

    val parsedJson = parse(json).toOption.get

    val productType: ProductType = decodeProduct.decodeJson(parsedJson).right.get

    productType.isInstanceOf[DigitalPack] mustBe true
    productType.billingPeriod mustBe Annual
    productType.currency mustBe Currency.USD
  }
}


