package com.gu.support.encoding

import cats.implicits._
import io.circe.Decoder.Result
import io.circe.generic.decoding.DerivedDecoder
import io.circe.generic.encoding.DerivedAsObjectEncoder
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Codec => _, _}
import shapeless.Lazy

import scala.reflect.ClassTag

class DiscriminatedType[TOPLEVEL](discriminatorFieldName: String) {

  def getSingle[A](list: List[A], message: String): A = list match {
    case Nil => throw new RuntimeException(s"no $message")
    case a :: Nil => a
    case many => throw new RuntimeException(s"duplicate $message: $many")
  }

  def encoder(allCodecs: List[this.VariantCodec[_ <: TOPLEVEL]]): Encoder[TOPLEVEL] = Encoder.instance { toplevel =>
    getSingle(allCodecs.flatMap(_.maybeEncode(toplevel)), "encoder for: " + toplevel.toString)
  }

  def decoder(allCodecs: List[this.VariantCodec[_ <: TOPLEVEL]]): Decoder[TOPLEVEL] = Decoder.instance { cursor =>
    for {
      decodeAttempts <- allCodecs.traverse(_.maybeDecode(cursor))
    } yield getSingle(decodeAttempts.flatten, "decoder for: " + cursor.value.toString)
  }

  def codec(allCodecs: List[this.VariantCodec[_ <: TOPLEVEL]]): Codec[TOPLEVEL] = {
    new Codec[TOPLEVEL](encoder(allCodecs), decoder(allCodecs))
  }

  def variant[A: ClassTag](discriminatorValue: String)(implicit
      decoder: Lazy[DerivedDecoder[A]],
      encoder: Lazy[DerivedAsObjectEncoder[A]],
  ): VariantCodec[A] = new VariantCodec[A](discriminatorValue)

  class VariantCodec[A: ClassTag](discriminatorValue: String)(implicit
      decode: Lazy[DerivedDecoder[A]],
      encode: Lazy[DerivedAsObjectEncoder[A]],
  ) extends Decoder[A]
      with Encoder[A] {

    private val encoder = deriveEncoder[A]
    private val decoder = deriveDecoder[A]

    def maybeDecode(cursor: HCursor): Result[Option[A]] =
      for {
        actualDiscriminator <- cursor.downField(discriminatorFieldName).as[String]
        result <- if (actualDiscriminator == discriminatorValue) decoder.apply(cursor).map(Some.apply) else Right(None)
      } yield result

    def maybeEncode(t: TOPLEVEL): Option[Json] =
      implicitly[ClassTag[A]].unapply(t).map(apply)

    override def apply(c: HCursor): Result[A] = maybeDecode(c).flatMap(
      _.toRight(
        DecodingFailure("discriminator value did not match", List(CursorOp.DownField(discriminatorFieldName))),
      ),
    )

    override def apply(a: A): Json =
      encoder(a).asObject.map(_.add(discriminatorFieldName, Json.fromString(discriminatorValue))).asJson

  }

}
