package com.gu.support.config

import com.gu.support.config.TouchPointEnvironments.{PROD, SANDBOX}

/** TouchPointEnvironment represents a logical environment for our backend systems, mainly Zuora and Salesforce. Any
  * environment *could* be used by any stage (see Stages) however in practice they are restricted to the following: DEV
  * and CODE stages use the SANDBOX environment for all users, the PROD stage uses the PROD environment for non test
  * users and SANDBOX for test users
  */
sealed trait TouchPointEnvironment {
  val envValue = this match {
    case SANDBOX => "DEV"
    case PROD => "PROD"
  }

  @deprecated // prefer envValue to gain type safety and easier static analysis
  override def toString: String = this match {
    case SANDBOX => "SANDBOX"
    case PROD => "PROD"
  }
}

object TouchPointEnvironments {

  case object SANDBOX extends TouchPointEnvironment // TODO rename SANDBOX to DEV
  case object PROD extends TouchPointEnvironment

  def fromStage(stage: Stage, isTestUser: Boolean = false): TouchPointEnvironment =
    if (isTestUser) SANDBOX
    else
      stage match {
        case Stages.DEV | Stages.CODE => SANDBOX
        case Stages.PROD => PROD
      }

  def fromString(string: String): TouchPointEnvironment =
    string match {
      case "PROD" => PROD
      case _ => SANDBOX
    }
}
