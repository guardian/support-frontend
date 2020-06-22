package com.gu.support.redemptions

import com.gu.support.encoding.Codec
import io.circe.{Decoder, Encoder}

object RedemptionCode {
  def apply(value: String): Either[String, RedemptionCode] = {
    // make sure no one can inject anything bad
    val validChars = List('A' -> 'Z', '0' -> '9', '-' -> '-')
    val validCharsSet = validChars.flatMap { case (from, to) => (from to to) }.toSet
    if (value.forall(validCharsSet.contains))
      Right(new RedemptionCode(value))
    else
      Left(s"redemption code must only include A-Z, 0-9 and '-'")
  }

  implicit val encoder: Encoder[RedemptionCode] = Encoder.encodeString.contramap(_.value)

  implicit val decoder: Decoder[RedemptionCode] = Decoder.decodeString.emap(apply)

  implicit val corporateCodec: Codec[RedemptionCode] = new Codec[RedemptionCode](encoder, decoder)

}
case class RedemptionCode private (value: String) extends AnyVal
