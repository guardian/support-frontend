package wiring

import config.{Configuration, StringsConfig}

trait ApplicationConfiguration { self: AppComponents =>
  val appConfig: Configuration = new Configuration(configuration.underlying)
  val stringsConfig: StringsConfig = new StringsConfig()
}
