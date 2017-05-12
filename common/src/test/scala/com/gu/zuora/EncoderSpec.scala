package com.gu.zuora

import com.gu.zuora.encoding.CapitalizationEncoder._
import com.gu.zuora.model.{ Invoice, InvoiceResult }
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import io.circe.syntax._
import org.scalatest.{ FlatSpec, Matchers }

class EncoderSpec extends FlatSpec with Matchers with LazyLogging {
  implicit val encoder = capitalizingEncoder[TestClass]
  implicit val decoderTestClass = decapitalizingDecoder[TestClass]
  implicit val decoderOuterClass = decapitalizingDecoder[OuterClass]
  implicit val decodeInvoice = decapitalizingDecoder[Invoice]
  implicit val decodeInvoiceResult = decapitalizingDecoder[InvoiceResult]

  case class TestClass(foo: String, bar: String)

  case class OuterClass(testClass: List[TestClass])

  "capitalizingEncoder" should "convert fieldnames to upper case" in {
    val testClass = TestClass("test", "test")

    val json = testClass.asJson

    (json \\ "Foo").head.asString.get should be("test")
  }

  "decapitalizingDecoder" should "decode from upper cased field names" in {
    val json = """{"Foo": "test", "Bar": "test"}"""

    val decodeResult = decode[TestClass](json)

    decodeResult.isRight should be(true)
  }

  it should "decode nested classes" in {
    val list = """[{"Foo": "test", "Bar": "test"}]"""
    val json = s"""{"TestClass": $list}"""

    val decodeResult = decode[OuterClass](json)

    decodeResult.isRight should be(true)
  }

  "decapitalizingDecoder" should "decode Invoice from upper cased field names" in {
    val json = """{"InvoiceNumber": "INV00051836","Id": "2c92c0f85be67835015be751f2c6655e"}"""

    val decodeResult = decode[Invoice](json)

    decodeResult.isRight should be(true)
  }

  it should "decode nested InvoiceRecord" in {
    val list = """[{"InvoiceNumber": "INV00051836","Id": "2c92c0f85be67835015be751f2c6655e"}]"""
    val json = s"""{"Invoice": $list}"""

    val decodeResult = decode[InvoiceResult](json)

    decodeResult.isRight should be(true)
  }
}
