package com.gu.zuora

import com.typesafe.config.Config

case class ZuoraConfig(url: String, username: String, password: String)

object ZuoraConfig{
  def fromConfig(config : Config) = ZuoraConfig(
    url = config.getString(s"zuora.api.url"),
    username = config.getString(s"zuora.api.username"),
    password = config.getString(s"zuora.api.password")
  )
}