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
    else {
      val groupsDesc = validChars.map {
        case (from, to) if from == to => s""""$from""""
        case (from, to) => s"$from-$to"
      }
      val withSep = groupsDesc.foldRight(List[String]()) { case (next, soFar) => if (soFar.isEmpty) List(" and ", next) else ", " :: next :: soFar }
      val description = withSep.tail.mkString
      Left(s"redemption code must only include $description")
    }
  }

  implicit val encoder: Encoder[RedemptionCode] = Encoder.encodeString.contramap(_.value)

  implicit val decoder: Decoder[RedemptionCode] = Decoder.decodeString.emap(apply)

  implicit val corporateCodec: Codec[RedemptionCode] = new Codec[RedemptionCode](encoder, decoder)

}
case class RedemptionCode private (value: String) extends AnyVal
