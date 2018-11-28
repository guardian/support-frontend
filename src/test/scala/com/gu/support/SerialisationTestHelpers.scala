package com.gu.support

import io.circe.Decoder
import io.circe.parser.decode
import org.scalatest.Matchers
import io.circe.Error

trait SerialisationTestHelpers extends Matchers{
  def testDecoding[T](fixture: String)(implicit decoder: Decoder[T]) = {
    val decodeResult = decode[T](fixture)
    assertDecodingSucceeded(decodeResult)
  }

  def assertDecodingSucceeded[T](decodeResult: Either[Error, T]) = decodeResult.fold(
    e => fail(e.getMessage),
    _ => succeed
  )
}

object SerialisationTestHelpers extends SerialisationTestHelpers
