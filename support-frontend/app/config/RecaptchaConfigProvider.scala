package config

import com.gu.support.config.Stage
import com.typesafe.config.Config

case class RecaptchaConfigProvider(config: Config, stage: Stage) {
  lazy val v2SecretKey = config.getString("v2.recaptcha.secretKey")
  lazy val v2PublicKey = config.getString("v2.recaptcha.publicKey")
}
