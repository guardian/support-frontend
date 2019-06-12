package wiring

import config.{Configuration, StringsConfig}

trait ApplicationConfiguration { self: AppComponents =>
  val appConfig = new Configuration(configuration.underlying)
  val stringsConfig = new StringsConfig()
}
