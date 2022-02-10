package com.gu.config.loaders

import com.gu.support.config.Stage
import com.typesafe.config.Config

trait PrivateConfigLoader {
  def load(stage: Stage, public: Config): Config
}

/** Loads private config from either /etc/gu or S3 depending on the environment
  */

object PrivateConfigLoader {
  def forEnvironment(loadFromS3: Boolean): PrivateConfigLoader =
    if (loadFromS3)
      new S3Loader
    else
      new LocalLoader
}
