package wiring

import config.CopyConfig

trait CopyConfiguration {
  val copyConfig = new CopyConfig()
}
