package com.gu.support.catalog

import com.gu.support.config.TouchPointEnvironment
import com.gu.support.config.TouchPointEnvironments.{PROD, SANDBOX, UAT}
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.{FlatSpec, Matchers}

@IntegrationTest
class CatalogServiceIntegrationSpec extends FlatSpec with Matchers {

  "CatalogService" should "load the correct catalog for the given environment" in {
    Console.println("Testing PROD")
    testEnvironment(PROD)
    Console.println("Testing UAT")
    testEnvironment(UAT)
    Console.println("Testing SANDBOX")
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
        service.getPriceList(ratePlan).fold {
          Console.println(s"Failed to find a catalog price list for $environment > $product > ${ratePlan.id}")
          fail()
        }(_ => succeed)
    )
}
