package com.gu.salesforce

import com.gu.support.config.{Stage, TouchpointConfigProvider}
import com.typesafe.config.Config

case class SalesforceConfig(
    environment: String,
    url: String,
    key: String,
    secret: String,
    username: String,
    password: String,
    token: String,
)
class SalesforceConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[SalesforceConfig](config, defaultStage) {
  def fromConfig(config: Config): SalesforceConfig = SalesforceConfig(
    environment = config.getString("environment"),
    url = config.getString("salesforce.url"),
    key = config.getString("salesforce.consumer.key"),
    secret = config.getString("salesforce.consumer.secret"),
    username = config.getString("salesforce.api.username"),
    password = config.getString("salesforce.api.password"),
    token = config.getString("salesforce.api.token"),
  )
}
