package com.gu.support.redemptions

import java.util.Locale

import com.gu.support.encoding.Codec
import io.circe.{Decoder, Encoder}

object RedemptionCode {
  def apply(value: String): Either[String, RedemptionCode] = {
    val upper = value.toUpperCase(Locale.UK)
    // make sure no one can inject anything bad
    val validChars = List('A' -> 'Z', '0' -> '9', '-' -> '-')
    val validCharsSet = validChars.flatMap { case (from, to) => (from to to) }.toSet
    if (upper.forall(validCharsSet.contains))
      Right(new RedemptionCode(upper))
    else
      Left(s"redemption code must only include A-Z, 0-9 and '-'")
  }

  implicit val encoder: Encoder[RedemptionCode] = Encoder.encodeString.contramap(_.value)

  implicit val decoder: Decoder[RedemptionCode] = Decoder.decodeString.emap(apply)

  implicit val corporateCodec: Codec[RedemptionCode] = new Codec[RedemptionCode](encoder, decoder)

}
case class RedemptionCode private (value: String)
