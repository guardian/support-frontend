package com.gu.support.workers.encoding

import io.circe.Decoder._
import io.circe.{Decoder, Encoder, HCursor, Json}

class Codec[T](enc: Encoder[T], dec: Decoder[T]) extends Encoder[T] with Decoder[T] {
  override def apply(a: T): Json = enc.apply(a)

  override def apply(c: HCursor): Result[T] = dec.apply(c)
}