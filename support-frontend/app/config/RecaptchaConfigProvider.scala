package config

import com.gu.support.config.{Stage, TouchpointConfig, TouchpointConfigProvider}
import com.typesafe.config.Config

case class RecaptchaConfig(
  v2SecretKey: String,
  v2PublicKey: String
) extends TouchpointConfig

class RecaptchaConfigProvider(config: Config, stage: Stage) extends TouchpointConfigProvider[RecaptchaConfig](config, stage) {
  def fromConfig(config: Config): RecaptchaConfig = {
    RecaptchaConfig(
      config.getString("v2.recaptcha.secretKey"),
      config.getString("v2.recaptcha.publicKey")
    )
  }
}
