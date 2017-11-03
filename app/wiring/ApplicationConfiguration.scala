package wiring

import config.{Configuration, StringsConfig}

trait ApplicationConfiguration {
  val appConfig = new Configuration()
  val stringsConfig = new StringsConfig()
}