package com.gu.acquisition.typeclasses

import ophan.thrift.event.{AbTest, AbTestInfo}
import org.scalatest.{Matchers, WordSpecLike}

class AbTestConverterSpec extends WordSpecLike with Matchers {

  case class ExampleABTest(testName: String, variantName: String)

  object ExampleABTest {
    implicit val abTestConverter = new AbTestConverter[ExampleABTest] {
      override def asAbTest(test: ExampleABTest): AbTest = AbTest(test.testName, test.variantName)
    }
  }

  "An AB test info instance" should {

    "be able to be created from a collection of a class with an implicit AB test converter in scope" in {
      import com.gu.acquisition.syntax.iterable._

      val tests = List(
        ExampleABTest("test1", "control1"),
        ExampleABTest("test2", "control2")
      )

      tests.asAbTestInfo shouldEqual AbTestInfo(Set(AbTest("test1", "control1"), AbTest("test2", "control2")))
    }
  }
}
