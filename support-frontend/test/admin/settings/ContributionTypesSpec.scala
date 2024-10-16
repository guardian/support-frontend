package admin.settings

import admin.settings.AmountsTests.AmountsTests
import io.circe
import io.circe.parser.decode
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import scala.io.Source

class ContributionTypesSpec extends AnyWordSpec with Matchers {
  "Amounts" should {
    "decode json" in {
      val json: String = Source.fromURL(getClass.getResource("/contributionTypes.json")).mkString
      val contributionTypes: Either[circe.Error, ContributionTypes] = decode[ContributionTypes](json)
      contributionTypes.isRight mustBe true
      contributionTypes.map(contributionTypes => contributionTypes.GBPCountries.size mustBe 3)
    }
  }
}
