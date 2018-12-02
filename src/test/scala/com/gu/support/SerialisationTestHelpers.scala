package com.gu.support

import io.circe.Decoder
import io.circe.parser.decode
import org.scalatest.{Assertion, Matchers}
import io.circe.Error

trait SerialisationTestHelpers extends Matchers{
  def testDecoding[T](fixture: String, objectChecks: T => Assertion = (_: T) => succeed)(implicit decoder: Decoder[T]) = {
    val decodeResult = decode[T](fixture)
    assertDecodingSucceeded(decodeResult, objectChecks)
  }

  def assertDecodingSucceeded[T](decodeResult: Either[Error, T], objectChecks: T => Assertion = (_: T) => succeed) = decodeResult.fold(
    e => fail(e.getMessage),
    result => objectChecks(result)
  )
}

object SerialisationTestHelpers extends SerialisationTestHelpers
