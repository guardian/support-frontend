package com.gu.support.config

import com.gu.support.config.TouchPointEnvironments.{PROD, CODE}

/** TouchPointEnvironment represents a logical environment for our backend systems, mainly Zuora and Salesforce. Any
  * environment *could* be used by any stage (see Stages) however in practice they are restricted to the following: DEV
  * and CODE stages use the CODE environment for all users, the PROD stage uses the PROD environment for non test users
  * and CODE for test users
  */
sealed trait TouchPointEnvironment {
  val envValue = this match {
    case CODE => "CODE"
    case PROD => "PROD"
  }
}

object TouchPointEnvironments {

  case object CODE extends TouchPointEnvironment
  case object PROD extends TouchPointEnvironment

  def fromStage(stage: Stage, isTestUser: Boolean = false): TouchPointEnvironment =
    if (isTestUser) CODE
    else
      stage match {
        case Stages.DEV | Stages.CODE => CODE
        case Stages.PROD => PROD
      }

  def fromString(string: String): TouchPointEnvironment =
    string match {
      case "PROD" => PROD
      case _ => CODE
    }
}
