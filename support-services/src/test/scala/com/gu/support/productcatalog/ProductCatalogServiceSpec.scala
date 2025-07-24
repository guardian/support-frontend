package com.gu.support.productcatalog

import com.gu.support.config.TouchPointEnvironments.PROD
import com.gu.support.productcatalog.ProductCatalogServiceSpec.serviceWithFixtures
import io.circe.parser
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.io.Source

object ProductCatalogServiceSpec {
  def serviceWithFixtures: ProductCatalogService = {
    val json = parser.parse(Source.fromURL(getClass.getResource("/product-catalog-prod.json")).mkString)
    val jsonProvider = new ProductCatalogJsonProvider {
      override def get: scala.util.Try[io.circe.Json] = json.toTry
    }
    new ProductCatalogService(jsonProvider)
  }
}

class ProductCatalogServiceSpec extends AsyncFlatSpec with Matchers {
  "ProductCatalogService" should "retrieve product rate plan ID correctly" in {
    serviceWithFixtures.getProductRatePlanId("SupporterPlus", "Monthly").map { productRatePlanId =>
      productRatePlanId shouldBe "8a128ed885fc6ded018602296ace3eb8"
    }
  }
  it should "retrieve charge ID correctly" in {
    val service = ProductCatalogService(PROD)
    serviceWithFixtures.getChargeId("Contribution", "Monthly", "Contribution").map { chargeId =>
      chargeId shouldBe "2c92a0fc5aacfadd015ad250bf2c6d38"
    }
  }
}
