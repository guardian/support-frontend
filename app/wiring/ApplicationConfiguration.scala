package wiring

import config.Configuration

trait ApplicationConfiguration {
  val appConfig = new Configuration()
}