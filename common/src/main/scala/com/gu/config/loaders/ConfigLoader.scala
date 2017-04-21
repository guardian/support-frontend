package com.gu.config.loaders

import com.gu.config.{Environment, Environments}
import com.typesafe.config.Config

trait ConfigLoader {
  def load() : Config
}

object ConfigLoader{
  def fromEnvironment(environment: Environment) = environment match {
    case Environments.LOCAL => new LocalLoader
    case _ => new S3Loader
  }
}
