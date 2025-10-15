package config

import com.gu.support.config.{Stage, Stages, TouchpointConfigProvider}
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

  override def get(isTestUser: Boolean): MparticleConfig = {
    if (isTestUser || stage != Stages.PROD) {
      MparticleConfig(
        apiUrl = "https://api.mparticle.com",
        tokenUrl = "https://sso.auth.mparticle.com/oauth/token",
        orgId = "4000380",
        accountId = "590",
        workspaceId = "1402",
        apiEnv = "development",
        clientId = "wuSwGiYqyUOLOpZaXatP8zLn3E5gKI9K",
        clientSecret = config.getString("mparticle.clientSecret"),
      )
    } else {
      MparticleConfig(
        apiUrl = "https://api.mparticle.com",
        tokenUrl = "https://sso.auth.mparticle.com/oauth/token",
        orgId = "4000380",
        accountId = "589",
        workspaceId = "1401",
        apiEnv = "production",
        clientId = "oPZDp2368A6WhUv2j7WC4n5nTI5xMg02",
        clientSecret = config.getString("mparticle.clientSecret"),
      )
    }
  }

  def fromConfig(config: Config): MparticleConfig = {
    throw new UnsupportedOperationException("fromConfig should not be used - configurations are hardcoded")
  }
}
