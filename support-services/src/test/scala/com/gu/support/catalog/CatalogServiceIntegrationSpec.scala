package com.gu.support.catalog

import com.gu.support.config.TouchPointEnvironment
import com.gu.support.config.TouchPointEnvironments.{PROD, SANDBOX, UAT}
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.{FlatSpec, Matchers}

@IntegrationTest
class CatalogServiceIntegrationSpec extends FlatSpec with Matchers {

  "CatalogService" should "load the correct catalog for the given environment" in {
    testEnvironment(PROD)
    testEnvironment(UAT)
    testEnvironment(SANDBOX)
  }

  private def testEnvironment(environment: TouchPointEnvironment) = {
    val service = CatalogService(environment)
    testProductAndEnvironment(service, DigitalPack, environment)
    testProductAndEnvironment(service, GuardianWeekly, environment)
    testProductAndEnvironment(service, Paper, environment)
  }

  private def testProductAndEnvironment(service: CatalogService, product: Product, environment: TouchPointEnvironment) =
    product.ratePlans(environment).map(
      ratePlan =>
        service.getPriceList(ratePlan).isDefined shouldBe true
    )
}
