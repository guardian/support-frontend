package com.gu.config.loaders

import java.io.File

import com.typesafe.config.ConfigFactory


class LocalLoader extends ConfigLoader{
  override def load() = ConfigFactory.parseFile(new File("/etc/gu/support.private.conf"))
}
