package services

import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class LandingPageTestServiceSpec extends AsyncFlatSpec with Matchers {
  "LandingPageTestService" should "parseLandingPageTest" in {
    LandingPageTestService.parseLandingPageTest()
//      result.isEmpty shouldBe false
  }
}
