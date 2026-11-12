package config

import com.gu.support.config.{Stage, Stages}
import com.typesafe.config.Config
import config.ConfigImplicits._
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder

case class MParticleConversionsConfig(apiKey: String, isDevelopmentMode: Boolean)

object MParticleConversionsConfig {
  implicit val encoder: Encoder[MParticleConversionsConfig] = deriveEncoder
}

class MParticleConversionsConfigProvider(config: Config, stage: Stage) {
  private val apiKey = config.getOptionalString("mparticle.web.apiKey").map(_.trim).filter(_.nonEmpty)

  def get(isTestUser: Boolean): Option[MParticleConversionsConfig] =
    apiKey.map(key => MParticleConversionsConfig(key, stage != Stages.PROD || isTestUser))
}
