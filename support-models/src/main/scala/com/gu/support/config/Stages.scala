package com.gu.support.config

import com.gu.support.config.Stages._

import scala.PartialFunction.condOpt

/** Stage represents a runtime environment either on a local machine (DEV) or in AWS (CODE or PROD)
  */
sealed trait Stage

object Stages {
  case object DEV extends Stage
  case object CODE extends Stage
  case object PROD extends Stage
}

object Stage {
  def fromString(s: String): Option[Stage] = condOpt(s) {
    case "DEV" => DEV
    case "CODE" => CODE
    case "PROD" => PROD
  }
}
