package com.gu.emailservices

import com.typesafe.config.Config

case class EmailServicesConfig(thankYou: EmailConfig, failed: EmailConfig)

case class EmailConfig(queueName: String, dataExtensionName: String)

object EmailServicesConfig {
  def fromConfig(config: Config): EmailServicesConfig =
    EmailServicesConfig(
      fromEmailConfig(config.getConfig("email.thankYou")),
      fromEmailConfig(config.getConfig("email.failed"))
    )

  private def fromEmailConfig(config: Config): EmailConfig =
    EmailConfig(config.getString("queueName"), config.getString("dataExtensionName"))
}