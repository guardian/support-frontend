package wiring

import config.StringsConfig

trait CopyConfiguration {
  val copyConfig = new StringsConfig()
}
