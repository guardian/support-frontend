package config

import com.gu.support.config.Stage
import com.typesafe.config.Config

case class RecaptchaConfigProvider(config: Config, stage: Stage) {

  lazy val secretKey = config.getString("recaptcha.secretKey")

}
