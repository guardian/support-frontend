package com.gu.model

import com.gu.supporterdata.model.Stage
import com.gu.supporterdata.model.Stage.{CODE, PROD}

object StageConstructors {

  def fromString(str: String): Option[Stage] =
    List(CODE, PROD)
      .find(_.value == str)

  def fromEnvironment: Stage =
    (for {
      stageAsString <- Option(System.getenv("Stage"))
      stage <- fromString(stageAsString)
    } yield stage).getOrElse(Stage.CODE)

}
