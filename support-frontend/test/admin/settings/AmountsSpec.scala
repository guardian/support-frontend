package admin.settings

import admin.settings.AmountsTests.AmountsTests
import io.circe
import io.circe.parser.{decode, parse}
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import io.circe.syntax.EncoderOps

import scala.io.Source

class AmountsSpec extends AnyWordSpec with Matchers {
  "Amounts" should {
    "decode json" in {
      val loadAmounts: String = Source.fromURL(getClass.getResource("/configured-amounts-v3.json")).mkString
      val amounts: Either[circe.Error, AmountsTests] = decode[AmountsTests](loadAmounts)
      amounts.isRight mustBe true
      amounts.map(amounts => amounts.length mustBe 10)
    }
    "encode json" in {
      val loadAmounts: String = Source.fromURL(getClass.getResource("/configured-amounts-v3.json")).mkString
      val amounts: Either[circe.Error, AmountsTests] = decode[AmountsTests](loadAmounts)
      amounts.map { amounts =>
        val json = amounts.asJson
        val parsed = parse(loadAmounts).toOption.get
        json mustBe parsed
      }
    }
  }
}
