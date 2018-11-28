package com.gu.support

import io.circe.Decoder
import io.circe.parser.decode
import org.scalatest.Matchers

trait SerialisationTestHelpers extends Matchers{
  def testDecoding[T](fixture: String)(implicit decoder: Decoder[T]) = {
    val decodeResult = decode[T](fixture)
    decodeResult.fold(
      e => fail(e.getMessage),
      _ => succeed
    )
  }
}
