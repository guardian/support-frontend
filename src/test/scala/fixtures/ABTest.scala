package com.gu.acquisition
package fixtures

import ophan.thrift.event.AbTest
import utils.AbTestConverter

case class ExampleABTest(testName: String, variantName: String)

object ExampleABTest {
  implicit val abTestConverter = new AbTestConverter[ExampleABTest] {
    override def asAbTest(test: ExampleABTest): AbTest = AbTest(test.testName, test.variantName)
  }
}