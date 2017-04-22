package com.gu.config.loaders

import java.io.File

import com.gu.config.Stage
import com.typesafe.config.{Config, ConfigFactory}


class LocalLoader extends PrivateConfigLoader {
  override def load(stage: Stage, public: Config) = ConfigFactory
      .parseFile(new File(public.getString("config.private.local")))
      .withFallback(public)
}
