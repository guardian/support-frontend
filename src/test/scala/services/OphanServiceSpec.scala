package services

import fixtures.ExampleABTest
import org.scalatest.{MustMatchers, WordSpec}

class OphanServiceSpec extends WordSpec with MustMatchers {
  val browserId = "browserId"
  val visitId = "visitId"

  "OphanService" must {
    import io.circe.syntax._
    import instances.abTestInfo._
    import syntax._

    "extract correct A/B test data" in {

      val tests = Set(
        ExampleABTest("test1", "control1"),
        ExampleABTest("test2", "control2")
      )

      tests.asAbTestInfo.asJson.noSpaces mustBe
        """{"test1":{"variantName":"control1"},"test2":{"variantName":"control2"}}"""
    }
  }
}
