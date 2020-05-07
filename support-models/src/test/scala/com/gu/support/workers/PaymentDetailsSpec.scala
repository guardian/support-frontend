package com.gu.support.workers

import com.gu.support.workers.states.{FreeProduct, PaidProduct, PaymentDetails}
import io.circe.{Decoder, DecodingFailure, Encoder, Json}
import org.scalatest.flatspec.AnyFlatSpec
import io.circe.parser._
import io.circe.generic.semiauto._
import io.circe.syntax._
import org.scalatest.matchers.should.Matchers

case class Foo(bar: String)
object Foo {
  implicit val encoder: Encoder[Foo] = deriveEncoder
  implicit val decoder: Decoder[Foo] = deriveDecoder
}

class PaymentDetailsSpec extends AnyFlatSpec with Matchers {
  "A PaidProduct" should "be encodeable and decodeable" in {
    val paymentDetails = PaidProduct(Foo("test"))
    val paymentJson = paymentDetails.asJson
    val resultPaymentDetails = decode[PaidProduct[Foo]](paymentJson.noSpaces)
    paymentDetails shouldBe resultPaymentDetails.right.get
  }

  "FreeProduct" should "be encodeable and decodeable" in {
    val resultJson = FreeProduct.asJson
    resultJson shouldBe Json.fromString("FreeProduct")
    val decoded = decode[FreeProduct.type ](resultJson.noSpaces)
    decoded.right.get shouldBe FreeProduct

    val next = decode[FreeProduct.type](Json.fromString("Not a free product").noSpaces)
    next.left.get shouldBe a[DecodingFailure]
  }

  "PaymentDetails" should "be encodeable and decodeable" in {
    val productDetails = decode[PaymentDetails[Foo]](Json.fromString("FreeProduct").noSpaces)
    productDetails.right.get shouldBe FreeProduct

    val paidJson = "{\"bar\": \"test\"}"
    val paid = decode[PaymentDetails[Foo]](paidJson)
    paid.right.get shouldBe PaidProduct(Foo("test"))
  }

  it should "be mappable" in {
    PaidProduct(Foo("test")).map(_.bar.reverse).get shouldBe "tset"
  }
}
