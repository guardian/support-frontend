package com.gu.support

import io.circe.{Decoder, Encoder, Error}
import io.circe.parser.decode
import io.circe.syntax._
import org.scalatest.Assertion
import org.scalatest.matchers.should.Matchers

trait SerialisationTestHelpers extends Matchers {
  def testDecoding[T : Decoder](fixture: String, objectChecks: T => Assertion = (_: T) => succeed): Assertion = {
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

  class SumTypeChecker[ROOT](implicit rootDecoder: Decoder[ROOT], encoderRoot: Encoder[ROOT]) {
    def testRoundTripSerialisationViaParent[T <: ROOT](t: T)(implicit decoder: Decoder[T], encoder: Encoder[T]): Assertion = {
      assertDecodingSucceeded(t.asJson(encoder).as[ROOT](rootDecoder), (decoded: ROOT) => decoded shouldEqual t)
      assertDecodingSucceeded((t: ROOT).asJson(encoderRoot).as[ROOT](rootDecoder), (decoded: ROOT) => decoded shouldEqual t)
    }
  }

  def testEncodeToDifferentState[STATE: Encoder, TARGETSTATE: Decoder](state: STATE, targetState: TARGETSTATE): Assertion =
    state.asJson.as[TARGETSTATE].fold(
      e => fail(e.getMessage),
      result => result should be(targetState)
    )

}

object SerialisationTestHelpers extends SerialisationTestHelpers
