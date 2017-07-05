package config

import com.typesafe.config.Config

case class StripeConfig(publicKey: String)

object StripeConfig {

  def fromConfig(config: Config): StripeConfig = {
    StripeConfig(config.getString("api.key.public"))
  }

}

class TouchpointConfigProvider(config: Config, defaultStage: Stage) {

  lazy val defaultStripeConfig = StripeConfig.fromConfig(
    config.getConfig(s"${defaultStage.toString}.stripe")
  )

  lazy val uatStripeConfig = StripeConfig.fromConfig(
    config.getConfig("UAT.stripe")
  )

  def getStripeConfig(isTestUser: Boolean): StripeConfig = {
    if (isTestUser) {
      uatStripeConfig
    } else {
      defaultStripeConfig
    }
  }

}
