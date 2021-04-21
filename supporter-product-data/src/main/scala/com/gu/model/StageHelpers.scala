package com.gu.model

import com.gu.supporterdata.model
import com.gu.supporterdata.model.Stage
import com.gu.supporterdata.model.Stage.{DEV, PROD, UAT}
import io.circe.{Decoder, Encoder}

object StageHelpers {

  def fromString(str: String): Either[String, model.Stage] =
    List(DEV, UAT, PROD)
      .find(_.value == str)
      .toRight(s"Unknown batch status $str")

  def fromEnvironment: model.Stage =
    (for {
      stageAsString <- Option(System.getenv("Stage"))
      stage <- fromString(stageAsString).toOption
    } yield stage).getOrElse(Stage.DEV)

}
