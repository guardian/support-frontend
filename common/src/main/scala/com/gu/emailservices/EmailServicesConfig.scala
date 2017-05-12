package com.gu.emailservices

import com.typesafe.config.Config

case class EmailServicesConfig(thankYouEmailQueue: String)

object EmailServicesConfig {

  def fromConfig(config: Config): EmailServicesConfig = {
    EmailServicesConfig(config.getString("email.thankYou.queueName"))
  }
}