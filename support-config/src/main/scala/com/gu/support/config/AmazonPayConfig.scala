package com.gu.support.config

import com.typesafe.config.Config

case class AmazonPayConfig(
    sellerId: String,
    clientId: String,
)

class AmazonPayConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[AmazonPayConfig](config, defaultStage) {
  def fromConfig(config: Config): AmazonPayConfig = {
    AmazonPayConfig(
      config.getString("amazonpay.sellerId"),
      config.getString("amazonpay.clientId"),
    )
  }
}
