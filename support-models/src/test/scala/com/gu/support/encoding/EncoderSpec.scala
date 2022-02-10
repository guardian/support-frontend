package com.gu.support.encoding

import com.gu.support.SerialisationTestHelpers
import com.gu.support.encoding.Codec._
import com.gu.support.zuora.api.response.{Invoice, InvoiceResult}
import com.typesafe.scalalogging.LazyLogging
import io.circe._
import io.circe.syntax._
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class EncoderSpec extends AsyncFlatSpec with Matchers with LazyLogging with SerialisationTestHelpers {
  implicit val encoder: Encoder[TestClass] = capitalizingEncoder[TestClass]
  implicit val decoderTestClass: Decoder[TestClass] = decapitalizingDecoder[TestClass]
  implicit val decoderOuterClass: Decoder[OuterClass] = decapitalizingDecoder[OuterClass]
  implicit val decodeInvoice: Decoder[Invoice] = decapitalizingDecoder[Invoice]
  implicit val decodeInvoiceResult: Decoder[InvoiceResult] = decapitalizingDecoder[InvoiceResult]

  case class TestClass(foo: String, bar: String)

  case class OuterClass(testClass: List[TestClass])

  "capitalizingEncoder" should "convert fieldnames to upper case" in {
    val testClass = TestClass("test", "test")

    val json = testClass.asJson

    (json \\ "Foo").head.asString.get should be("test")
  }

  "decapitalizingDecoder" should "decode from upper cased field names" in {
    val json = """{"Foo": "test", "Bar": "test"}"""
    testDecoding[TestClass](json)
  }

  it should "decode nested classes" in {
    val list = """[{"Foo": "test", "Bar": "test"}]"""
    val json = s"""{"TestClass": $list}"""

    testDecoding[OuterClass](json)
  }

  "decapitalizingDecoder" should "decode Invoice from upper cased field names" in {
    val json = """{"InvoiceNumber": "INV00051836","Id": "2c92c0f85be67835015be751f2c6655e"}"""

    testDecoding[Invoice](json)
  }

  it should "decode nested InvoiceRecord" in {
    val list = """[{"InvoiceNumber": "INV00051836","Id": "2c92c0f85be67835015be751f2c6655e"}]"""
    val json = s"""{"Invoice": $list}"""

    testDecoding[InvoiceResult](json)
  }

  "JsonObjectExtensions" should "rename a field successfully" in {
    import JsonHelpers.JsonObjectExtensions

    val json = Json.fromString("hello")
    val jsonObject = JsonObject(("a", json))
    val result = jsonObject.renameField("a", "b")

    result("b") shouldBe Some(json)
    result("a") shouldBe None
  }
}
