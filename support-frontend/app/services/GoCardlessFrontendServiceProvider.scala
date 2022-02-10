package services

import com.gu.support.config.{GoCardlessConfig, GoCardlessConfigProvider}
import com.gu.support.touchpoint.TouchpointServiceProvider

import scala.concurrent.ExecutionContext

class GoCardlessFrontendServiceProvider(configProvider: GoCardlessConfigProvider)(implicit
    executionContext: ExecutionContext,
) extends TouchpointServiceProvider[GoCardlessFrontendService, GoCardlessConfig](configProvider) {
  override protected def createService(config: GoCardlessConfig) = new GoCardlessFrontendService(config)
}
