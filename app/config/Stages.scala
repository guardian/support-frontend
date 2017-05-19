package config

import PartialFunction.condOpt
import Stages._

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