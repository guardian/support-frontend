package config

import PartialFunction.condOpt
import Stages._

sealed trait Stage

object Stages {
  case object DEV extends Stage
  case object CODE extends Stage
  case object PROD extends Stage
}

sealed trait TouchPointEnvironment

object TouchPointEnvironments {
  case object SANDBOX extends TouchPointEnvironment
  case object UAT extends TouchPointEnvironment
  case object PROD extends TouchPointEnvironment

  def fromStage(stage: Stage): TouchPointEnvironment =
    stage match {
      case Stages.DEV => SANDBOX
      case Stages.CODE => SANDBOX
      case Stages.PROD => PROD
    }
}

object Stage {
  def fromString(s: String): Option[Stage] = condOpt(s) {
    case "DEV" => DEV
    case "CODE" => CODE
    case "PROD" => PROD
  }
}