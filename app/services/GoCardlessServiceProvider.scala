package services

import services.touchpoint.TouchpointServiceProvider

import scala.concurrent.ExecutionContext

class GoCardlessServiceProvider(configProvider: GoCardlessConfigProvider)(implicit executionContext: ExecutionContext)
  extends TouchpointServiceProvider[GoCardlessService, CoCardLessConfig](configProvider) {
  override protected def createService(config: GoCardlessConfig) =
    new GoCardlessService(config.apiToken, config.environment)
}
