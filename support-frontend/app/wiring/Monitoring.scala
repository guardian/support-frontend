package wiring

import com.gu.tip.Tip
import monitoring.TipFromConfig
import play.api.BuiltInComponentsFromContext

trait Monitoring {

  self: BuiltInComponentsFromContext with ApplicationConfiguration =>

  lazy val tipMonitoring: Tip = TipFromConfig(appConfig)

}
