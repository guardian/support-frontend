package services.paypal

import com.gu.support.config.{PayPalCompletePaymentsConfig, PayPalCompletePaymentsConfigProvider}
import com.gu.support.touchpoint.TouchpointServiceProvider
import play.api.libs.ws.WSClient
import services.PayPalCompletePaymentsService

import scala.concurrent.ExecutionContext

class PayPalCompletePaymentsServiceProvider(configProvider: PayPalCompletePaymentsConfigProvider, wsClient: WSClient)(
    implicit executionContext: ExecutionContext,
) extends TouchpointServiceProvider[PayPalCompletePaymentsService, PayPalCompletePaymentsConfig](configProvider) {
  override protected def createService(config: PayPalCompletePaymentsConfig) =
    new PayPalCompletePaymentsService(config, wsClient)
}
