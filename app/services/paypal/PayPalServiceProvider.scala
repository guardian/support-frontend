package services.paypal

import com.gu.support.config.{PayPalConfig, PayPalConfigProvider}
import lib.okhttp.RequestRunners
import services.PayPalService
import services.touchpoint.TouchpointServiceProvider

import scala.concurrent.ExecutionContext

class PayPalServiceProvider(configProvider: PayPalConfigProvider, wsClient: WSClient)(implicit executionContext: ExecutionContext)
    extends TouchpointServiceProvider[PayPalService, PayPalConfig](configProvider) {
  override protected def createService(config: PayPalConfig) =
    new PayPalService(config, wsClient)
}
