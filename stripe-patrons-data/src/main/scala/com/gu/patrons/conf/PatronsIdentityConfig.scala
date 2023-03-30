package com.gu.patrons.conf

import com.gu.patrons.services.{ConfigService, ParameterStoreService}
import com.gu.supporterdata.model.Stage

import scala.concurrent.ExecutionContext

case class PatronsIdentityConfig(apiUrl: String, apiClientToken: String)

object PatronsIdentityConfig extends ConfigService {
  def fromParameterStore(stage: Stage)(implicit ec: ExecutionContext) = {
    ParameterStoreService(stage).getParametersByPath("identity-config").map { params =>
      PatronsIdentityConfig(
        findParameterOrThrow("api-url", params),
        findParameterOrThrow("api-token", params),
      )
    }
  }

  def fromParameterStoreSync(stage: Stage) = {
    val params = ParameterStoreService(stage).getParametersByPathSync("identity-config")
    PatronsIdentityConfig(
      findParameterOrThrow("api-url", params),
      findParameterOrThrow("api-token", params),
    )
  }
}
