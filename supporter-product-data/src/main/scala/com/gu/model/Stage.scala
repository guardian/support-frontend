package com.gu.model

import io.circe.{Decoder, Encoder}

sealed abstract class Stage(val value: String)

object Stage {

  case object DEV extends Stage("DEV")

  case object UAT extends Stage("UAT")

  case object PROD extends Stage("PROD")

  implicit val encoder : Encoder[Stage] = Encoder.encodeString.contramap(_.value)
  implicit val decoder: Decoder[Stage] = Decoder.decodeString.emap(fromString)

  def fromString(str: String): Either[String, Stage] =
    List(DEV, UAT, PROD)
      .find(_.value == str)
      .toRight(s"Unknown batch status $str")

  def fromEnvironment: Stage =
    (for {
      stageAsString <- Option(System.getenv("Stage"))
      stage <- fromString(stageAsString).toOption
    } yield stage).getOrElse(Stage.DEV)

}
