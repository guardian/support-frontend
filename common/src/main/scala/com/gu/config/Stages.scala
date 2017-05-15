package com.gu.config
import scala.language.implicitConversions

object Stages {
  val DEV = Stage("DEV")
  val UAT = Stage("UAT")
  val PROD = Stage("PROD")
}

case class Stage(name: String)

object Stage {
  implicit def stageToString(s: Stage): String = s.name
}
