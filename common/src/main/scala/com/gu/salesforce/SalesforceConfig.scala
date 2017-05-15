package com.gu.salesforce

case class SalesforceConfig(
  url: String,
  key: String,
  secret: String,
  username: String,
  password: String,
  token: String
)

object SalesforceConfig {
  def fromConfig(config: com.typesafe.config.Config): SalesforceConfig = SalesforceConfig(
    url = config.getString("salesforce.url"),
    key = config.getString("salesforce.consumer.key"),
    secret = config.getString("salesforce.consumer.secret"),
    username = config.getString("salesforce.api.username"),
    password = config.getString("salesforce.api.password"),
    token = config.getString("salesforce.api.token")
  )
}
