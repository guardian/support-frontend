package services

import com.gocardless.GoCardlessClient.Environment
import com.gu.support.config.{Stage, TouchpointConfig, TouchpointConfigProvider}
import com.typesafe.config.Config

case class GoCardlessConfig(
    apiToken: String,
    environment: Environment
) extends TouchpointConfig

class GoCardlessConfigProvider(config: Config, defaultStage: Stage) extends TouchpointConfigProvider[GoCardlessConfig](config, defaultStage) {
  def fromConfig(config: Config): GoCardlessConfig = {
    GoCardlessConfig(
      config.getString("gocardless.token"),
      Environment.valueOf(config.getString("gocardless.environment"))
    )
  }
}
