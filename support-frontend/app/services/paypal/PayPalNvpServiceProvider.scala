package services.paypal

import com.gu.support.config.{PayPalConfig, PayPalConfigProvider}
import com.gu.support.touchpoint.TouchpointServiceProvider
import play.api.libs.ws.WSClient
import services.PayPalNvpService

import scala.concurrent.ExecutionContext

class PayPalNvpServiceProvider(configProvider: PayPalConfigProvider, wsClient: WSClient)(implicit
    executionContext: ExecutionContext,
) extends TouchpointServiceProvider[PayPalNvpService, PayPalConfig](configProvider) {
  override protected def createService(config: PayPalConfig) =
    new PayPalNvpService(config, wsClient)
}
