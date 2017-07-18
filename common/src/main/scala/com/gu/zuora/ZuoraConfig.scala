package com.gu.zuora

import com.gu.support.config.{Stage, TouchpointConfig, TouchpointConfigProvider}
import com.typesafe.config.Config

case class ZuoraConfig(url: String, username: String, password: String, productRatePlanId: String, productRatePlanChargeId: String) extends TouchpointConfig

class ZuoraConfigProvider(config: Config, defaultStage: Stage) extends TouchpointConfigProvider[ZuoraConfig](config, defaultStage) {
  def fromConfig(config: Config): ZuoraConfig = ZuoraConfig(
    url = config.getString(s"zuora.api.url"),
    username = config.getString(s"zuora.api.username"),
    password = config.getString(s"zuora.api.password"),
    productRatePlanId = config.getString(s"zuora.productRatePlanIds.contribution"),
    productRatePlanChargeId = config.getString(s"zuora.productRatePlanChargeIds.contribution")
  )
}