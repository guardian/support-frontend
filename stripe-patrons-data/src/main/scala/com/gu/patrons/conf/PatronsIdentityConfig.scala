package com.gu.patrons.conf

import com.gu.monitoring.SafeLogger
import com.gu.patrons.services.{ConfigService, ParameterStoreService}
import com.gu.supporterdata.model.Stage

case class PatronsIdentityConfig(apiUrl: String, apiClientToken: String)

object PatronsIdentityConfig extends ConfigService {
  def fromParameterStoreSync(stage: Stage): PatronsIdentityConfig = {
    logger.info(s"Loading Identity config")
    val params = ParameterStoreService(stage).getParametersByPathSync("identity-config")
    PatronsIdentityConfig(
      findParameterOrThrow("api-url", params),
      findParameterOrThrow("api-token", params),
    )
  }
}
