package wiring

import assets.AssetsResolver
import play.api.BuiltInComponentsFromContext

trait Assets { self: BuiltInComponentsFromContext =>
  val assetsResolver = new AssetsResolver("", "assets.map", environment)
}
