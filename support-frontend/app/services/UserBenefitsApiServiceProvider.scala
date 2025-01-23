package services

import com.gu.support.config.{UserBenefitsApiConfig, UserBenefitsApiConfigProvider}
import com.gu.support.touchpoint.TouchpointServiceProvider
import play.api.libs.ws.WSClient

import scala.concurrent.ExecutionContext

class UserBenefitsApiServiceProvider(configProvider: UserBenefitsApiConfigProvider)(implicit
    executionContext: ExecutionContext,
    wsClient: WSClient,
) extends TouchpointServiceProvider[UserBenefitsApiService, UserBenefitsApiConfig](configProvider) {
  override protected def createService(config: UserBenefitsApiConfig) =
    new UserBenefitsApiService(config.host, config.apiKey)
}
