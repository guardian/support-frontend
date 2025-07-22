package com.gu.support.productcatalog

import com.gu.support.config.TouchPointEnvironments.PROD
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.Future

class ProductCatalogServiceSpec extends AsyncFlatSpec with Matchers {
  "ProductCatalogService" should "retrieve product rate plan ID correctly" in {
    val service = ProductCatalogService(PROD)
    service.getProductRatePlanId("SupporterPlus", "Monthly").map { productRatePlanId =>
      productRatePlanId shouldBe "8a128ed885fc6ded018602296ace3eb8"
    }
  }
  it should "retrieve charge ID correctly" in {
    val service = ProductCatalogService(PROD)
    service.getChargeId("Contribution", "Monthly", "Contribution").map { chargeId =>
      chargeId shouldBe "2c92a0fc5aacfadd015ad250bf2c6d38"
    }
  }
}
