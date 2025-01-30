package com.gu.support.config

import com.typesafe.config.Config

case class UserBenefitsApiConfig(
    host: String,
    apiKey: String,
)

class UserBenefitsApiConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[UserBenefitsApiConfig](config, defaultStage) {
  def fromConfig(config: Config): UserBenefitsApiConfig = {
    UserBenefitsApiConfig(
      config.getString("userBenefitsApi.host"),
      config.getString("userBenefitsApi.apiKey"),
    )
  }
}
