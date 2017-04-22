package com.gu.config.loaders

import com.gu.config.{Stage, Stages}
import com.typesafe.config.Config

trait PrivateConfigLoader {
  def load(stage: Stage, public: Config) : Config
}

/**
  * Loads private config from either /etc/gu or S3 depending on the environment
  */
object PrivateConfigLoader{
  def forEnvironment(local: Boolean) = if (local) {
    new LocalLoader
  }
  else {
    new S3Loader
  }
}
