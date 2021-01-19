package com.gu.model

import io.circe.{Decoder, Encoder}

sealed abstract class Stage(val value: String)

object Stage {

  case object DEV extends Stage("DEV")

  case object CODE extends Stage("CODE")

  case object PROD extends Stage("PROD")

  implicit val encoder : Encoder[Stage] = Encoder.encodeString.contramap(_.value)
  implicit val decoder: Decoder[Stage] = Decoder.decodeString.emap(fromString)

  def fromString(str: String): Either[String, Stage] =
    List(DEV, CODE, PROD)
      .find(_.value == str)
      .toRight(s"Unknown batch status $str")

}
