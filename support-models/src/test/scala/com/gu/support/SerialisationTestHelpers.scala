package com.gu.support

import io.circe.{Decoder, Encoder, Error}
import io.circe.parser.decode
import io.circe.syntax._
import org.scalatest.{Assertion, Matchers}

trait SerialisationTestHelpers extends Matchers {
  def testDecoding[T](fixture: String, objectChecks: T => Assertion = (_: T) => succeed)(implicit decoder: Decoder[T]): Assertion = {
    val decodeResult = decode[T](fixture)
    assertDecodingSucceeded(decodeResult, objectChecks)
  }

  def assertDecodingSucceeded[T](decodeResult: Either[Error, T], objectChecks: T => Assertion = (_: T) => succeed): Assertion =
    decodeResult.fold(
      e => fail(e.getMessage),
      result => objectChecks(result)
    )

  def testRoundTripSerialisation[T](t: T)(implicit decoder: Decoder[T], encoder: Encoder[T]): Assertion = {
    val json = t.asJson
    assertDecodingSucceeded(json.as[T], (decoded: T) => decoded shouldEqual t)
  }
}

object SerialisationTestHelpers extends SerialisationTestHelpers
