package com.gu.services

import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.io.Source
import scala.util.{Success, Try, Using}

@IntegrationTest
class DiscountServiceSpec extends AnyFlatSpec with Matchers {
  class FixtureCatalogLoader extends CatalogLoader {
    override def loadCatalog: Try[String] =
      Using(Source.fromURL(getClass.getResource("/catalog-prod.json")))(_.mkString)
  }

  DiscountService.getClass.getSimpleName should "find discount product rate plan ids successfully" in {
    val res = new DiscountService(new FixtureCatalogLoader).getDiscountProductRatePlanIds
    res.map(_.size) shouldBe Success(43)
  }
}
