package com.gu.config.loaders

import java.io.File

import com.gu.support.config.Stage
import com.typesafe.config.{Config, ConfigFactory}

class LocalLoader extends PrivateConfigLoader {
  override def load(stage: Stage, public: Config): Config = ConfigFactory
    .parseFile(new File(public.getString("config.private.local")))
    .withFallback(public)
}
