package wiring

import com.gu.tip.Tip
import play.api.BuiltInComponentsFromContext

trait Monitoring {
  self: BuiltInComponentsFromContext with ApplicationConfiguration =>

  lazy val tipMonitoring: Tip = monitoring.TipMonitoring.init(appConfig)

}
