package codecs

import org.scalatest.{MustMatchers, WordSpec}
import codecs.CirceDecoders.referrerAcquisitionDataCodec
import io.circe.Json
import io.circe.parser.parse
import cats.syntax.either._
class CirceDecodersTest extends WordSpec with MustMatchers {

  "referrerAcquisitionDataCodec" should {
    "decode json" in {
      val json =
        """
          |{
          |   "campaignCode":"example",
          |   "abTest":[]
          |}
        """
          .stripMargin

      val parsedJson = parse(json).toOption.get

      referrerAcquisitionDataCodec.decodeJson(parsedJson).right.get.campaignCode.get mustBe "example"
      referrerAcquisitionDataCodec.decodeJson(parsedJson).right.get.abTest mustBe None
    }
  }

  "ophanIdsCodec" should {

  }

  "supportAbTestsCodec" should {

  }

  "componentTypeCodec" should {

  }

  "acquisitionSourceCodec" should {

  }
  
}
