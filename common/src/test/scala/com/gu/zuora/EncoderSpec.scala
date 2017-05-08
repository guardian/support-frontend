package com.gu.zuora

import com.gu.zuora.encoding.CapitalizationEncoder._
import com.gu.zuora.encoding.CustomCodecs
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import io.circe.syntax._
import org.scalatest.{FlatSpec, Matchers}


class EncoderSpec extends FlatSpec with Matchers with LazyLogging {

  case class TestClass(foo: String, bar: String)

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

}
