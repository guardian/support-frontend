package services

import com.gu.monitoring.SafeLogging
import com.gu.support.config.PayPalCompletePaymentsConfig
import com.gu.support.touchpoint.TouchpointService
import play.api.libs.ws.WSClient

import scala.concurrent.Future

class PayPalCompletePaymentsService(apiConfig: PayPalCompletePaymentsConfig, wsClient: WSClient)
    extends TouchpointService
    with SafeLogging {

  def createSetupToken: Future[Option[String]] = Future.successful(Some("dummy-token"))
}
