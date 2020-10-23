package com.gu.support.encoding

import io.circe.Decoder.Result
import io.circe.generic.decoding.DerivedDecoder
import io.circe.generic.encoding.DerivedAsObjectEncoder
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder, HCursor, Json}
import shapeless.Lazy

import scala.reflect.ClassTag

class DiscriminatedType[TOPLEVEL](discriminatorFieldName: String) {

  def getSingle[A](list: List[A], message: String): A = list match {
    case Nil => throw new RuntimeException(s"no codec for: $message")
    case a :: Nil => a
    case many => throw new RuntimeException(s"duplicate codec for: $message: $many")
  }

  def encoder(allCodecs: List[this.VariantCodec[_ <: TOPLEVEL]]): Encoder[TOPLEVEL] = Encoder.instance { toplevel =>
    getSingle(allCodecs.flatMap(_.maybeEncode(toplevel)), toplevel.toString)
  }

  def decoder(allCodecs: List[this.VariantCodec[_ <: TOPLEVEL]]): Decoder[TOPLEVEL] = Decoder.instance { cursor =>
    for {
      discriminator <- cursor.downField(discriminatorFieldName).as[String]
      result <- getSingle(allCodecs.flatMap(_.maybeDecode(discriminator, cursor)), discriminator)
    } yield result
  }

  def codec(allCodecs: List[this.VariantCodec[_ <: TOPLEVEL]]): Codec[TOPLEVEL] = {
    new Codec[TOPLEVEL](encoder(allCodecs), decoder(allCodecs))
  }

  def variant[A: ClassTag](discriminatorValue: String)(
    implicit
    decoder: Lazy[DerivedDecoder[A]],
    encoder: Lazy[DerivedAsObjectEncoder[A]]
  ): VariantCodec[A] = new VariantCodec[A](discriminatorValue)

  class VariantCodec[A: ClassTag](discriminatorValue: String)(implicit decode: Lazy[DerivedDecoder[A]], encode: Lazy[DerivedAsObjectEncoder[A]])
    extends Decoder[A] with Encoder[A] {

    private val encoder = deriveEncoder[A].mapJson(_.asObject.map(_.add(discriminatorFieldName, Json.fromString(discriminatorValue))).asJson)
    private val decoder = deriveDecoder[A] // doesn't (re)check the discrim - fix?

    def maybeDecode(actualDiscriminator: String, cursor: HCursor): Option[Result[A]] =
      if (actualDiscriminator == discriminatorValue) Some(apply(cursor)) else None

    def maybeEncode(t: TOPLEVEL): Option[Json] =
      implicitly[ClassTag[A]].unapply(t).map(apply)

    override def apply(c: HCursor): Result[A] = decoder(c)

    override def apply(a: A): Json = encoder(a)

  }

}
