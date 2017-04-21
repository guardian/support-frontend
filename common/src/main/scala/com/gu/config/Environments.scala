package com.gu.config

object Environments {
  val LOCAL = Environment("LOCAL") //special case for lambdas running locally
  val DEV = Environment("DEV")
  val UAT = Environment("UAT")
  val PROD = Environment("PROD")

  def getStage(environment: Environment) = environment match {
    case LOCAL => DEV
    case _ => environment
  }
}

case class Environment(name: String)
