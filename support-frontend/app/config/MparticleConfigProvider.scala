package config

import com.gu.support.config.{Stage, TouchpointConfigProvider}
import com.typesafe.config.Config

case class MparticleConfig(
    apiUrl: String,
    tokenUrl: String,
    orgId: String,
    accountId: String,
    workspaceId: String,
    apiEnv: String,
    clientId: String,
    clientSecret: String,
)

class MparticleConfigProvider(config: Config, stage: Stage)
    extends TouchpointConfigProvider[MparticleConfig](config, stage) {

  // Override to get clientSecret from main config (includes private config)
  override def get(isTestUser: Boolean): MparticleConfig = {
    val touchpointConfig = super.get(isTestUser)
    touchpointConfig.copy(
      clientSecret = config.getString("mparticle.clientSecret"),
    )
  }

  def fromConfig(config: Config): MparticleConfig = {
    MparticleConfig(
      config.getString("mparticle.apiUrl"),
      config.getString("mparticle.tokenUrl"),
      config.getString("mparticle.orgId"),
      config.getString("mparticle.accountId"),
      config.getString("mparticle.workspaceId"),
      config.getString("mparticle.apiEnv"),
      config.getString("mparticle.clientId"),
      "",
    )
  }
}
