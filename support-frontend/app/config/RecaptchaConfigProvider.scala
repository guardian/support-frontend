package config

import com.gu.support.config.Stage
import com.typesafe.config.Config

case class RecaptchaConfigProvider(config: Config, stage: Stage) {

  lazy val v3SecretKey = config.getString("recaptcha.secretKey")
  lazy val v3PublicKey = config.getString("recaptcha.publicKey")

  lazy val v2SecretKey = config.getString("v2.recaptcha.secretKey")
  lazy val v2PublicKey = config.getString("v2.recaptcha.publicKey")
}
