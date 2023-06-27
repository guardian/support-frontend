package com.gu.support.catalog

import com.gu.support.config.TouchPointEnvironment
import com.gu.support.config.TouchPointEnvironments.{CODE, PROD}
import com.gu.support.workers.{Annual, BillingPeriod, Monthly, Quarterly}
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

case class TestData(
    product: Product,
    billingPeriods: List[BillingPeriod],
    fulfilmentOptions: List[FulfilmentOptions],
    productOptions: List[ProductOptions],
)

class ProductRatePlanSpec extends AnyFlatSpec with Matchers {

  val testData = List(
    TestData(
      DigitalPack,
      List(Monthly, Annual),
      List(NoFulfilmentOptions),
      List(NoProductOptions),
    ),
    TestData(
      SupporterPlus,
      List(Monthly, Annual),
      List(NoFulfilmentOptions),
      List(NoProductOptions),
    ),
    TestData(
      Paper,
      List(Monthly),
      List(HomeDelivery, Collection),
      List(Everyday, Sixday),
    ),
    TestData(
      GuardianWeekly,
      List(Monthly, Quarterly, Annual),
      List(Domestic, RestOfWorld),
      List(NoProductOptions),
    ),
    TestData(
      Contribution,
      List(Monthly, Annual),
      List(NoFulfilmentOptions),
      List(NoProductOptions),
    ),
  )

  "Products defined in Product.scala" should "have exactly one product rate plan for every product configuration" in {
    val environments = List(PROD, CODE)
    for {
      environment <- environments
      testDatum <- testData
      _ = println(s"Testing ${testDatum.product} in $environment")
      result = testProduct(environment, testDatum)
    } yield result
    succeed
  }

  def testProduct(environment: TouchPointEnvironment, testDatum: TestData) = {
    for {
      billingPeriod <- testDatum.billingPeriods
      fulfilmentOption <- testDatum.fulfilmentOptions
      productOption <- testDatum.productOptions
    } yield {
      testDatum.product.getProductRatePlan(environment, billingPeriod, fulfilmentOption, productOption) match {
        case Some(_) =>
          println(
            s"Found a single product rate plan for ${testDatum.product} $billingPeriod $fulfilmentOption $productOption",
          )
        case None =>
          println(
            s"Couldn't find a product rate plan for ${testDatum.product} $billingPeriod $fulfilmentOption $productOption",
          )
          fail()
      }
      succeed
    }

  }
}
