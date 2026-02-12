package services.paypal

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.support.config.{PayPalCompletePaymentsConfig, PayPalCompletePaymentsConfigProvider, Stage}
import com.gu.support.touchpoint.TouchpointServiceProvider
import services.PayPalCompletePaymentsService

import scala.concurrent.ExecutionContext

class PayPalCompletePaymentsServiceProvider(
    configProvider: PayPalCompletePaymentsConfigProvider,
    client: FutureHttpClient,
)(implicit
    executionContext: ExecutionContext,
) extends TouchpointServiceProvider[PayPalCompletePaymentsService, PayPalCompletePaymentsConfig](configProvider) {
  override protected def createService(config: PayPalCompletePaymentsConfig) = {
    new PayPalCompletePaymentsService(config, client)
  }
}
