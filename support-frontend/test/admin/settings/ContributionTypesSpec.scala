package admin.settings

import admin.settings.AmountsTests.AmountsTests
import io.circe
import io.circe.parser.decode
import org.scalatest.EitherValues
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import scala.io.Source

class ContributionTypesSpec extends AnyWordSpec with Matchers with EitherValues {
  "ContributionTypes" should {
    "decode correctly" in {
      val json: String = Source.fromURL(getClass.getResource("/contributionTypes.json")).mkString
      val contributionTypes: Either[circe.Error, ContributionTypes] = decode[ContributionTypes](json)
      contributionTypes.value.GBPCountries.size mustBe 3
    }
  }
}
