package wiring

import config.{Configuration, StringsConfig}
import switchboard.Switches

trait ApplicationConfiguration {
  val appConfig = new Configuration()
  val stringsConfig = new StringsConfig()
}
