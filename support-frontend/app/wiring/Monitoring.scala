package wiring

import com.gu.tip.Tip
import monitoring.TipFromConfig
import play.api.BuiltInComponentsFromContext

trait Monitoring {

  self: BuiltInComponentsFromContext with AppComponents =>

  lazy val tipMonitoring: Tip = TipFromConfig(appConfig)

}
