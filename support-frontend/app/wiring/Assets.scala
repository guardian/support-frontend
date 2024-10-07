package wiring

import assets.AssetsResolver
import play.api.BuiltInComponentsFromContext

trait Assets { self: BuiltInComponentsFromContext =>
  val assetsResolver: AssetsResolver = new AssetsResolver("", "assets.json", environment)
}
