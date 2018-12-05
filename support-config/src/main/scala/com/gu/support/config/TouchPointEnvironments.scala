package com.gu.support.config

/**
 * TouchPointEnvironment represents a logical environment for our backend systems, mainly Zuora and Salesforce.
 * Any environment *could* be used by any stage (see Stages) however in practice they are restricted to the following:
 * DEV and CODE stages use the SANDBOX environment for non test users the UAT environment for test users
 * PROD stage uses the PROD environment for non test users and UAT for test users
 */
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
