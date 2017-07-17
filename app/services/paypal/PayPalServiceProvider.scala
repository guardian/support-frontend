package services.paypal

import config.{PayPalConfig, PayPalConfigProvider}
import lib.okhttp.RequestRunners
import services.PayPalService
import services.touchpoint.TouchpointServiceProvider

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

class PayPalServiceProvider(configProvider: PayPalConfigProvider)(implicit executionContext: ExecutionContext) extends
  TouchpointServiceProvider[PayPalService, PayPalConfig](configProvider) {
  override protected def createService(config: PayPalConfig) =
    new PayPalService(config, RequestRunners.configurableFutureRunner(40.seconds))
}
