package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.AssetsResolver
import com.gu.monitoring.SafeLogging
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.syntax.EncoderOps
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents, Request}
import services.TestUserService
import services.paypal.PayPalCompletePaymentsServiceProvider

import scala.concurrent.ExecutionContext

case class SetupTokenRequest()
object SetupTokenRequest {
  implicit val codec: Codec[SetupTokenRequest] = deriveCodec
}

case class PaymentTokenRequest(setup_token: String)
object PaymentTokenRequest {
  implicit val codec: Codec[PaymentTokenRequest] = deriveCodec
}

case class SetupTokenResponse(token: String)
object SetupTokenResponse {
  implicit val codec: Codec[SetupTokenResponse] = deriveCodec
}

case class PaymentTokenResponse(token: String, email: String)
object PaymentTokenResponse {
  implicit val codec: Codec[PaymentTokenResponse] = deriveCodec
}

class PayPalCompletePaymentsController(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    payPalCPServiceProvider: PayPalCompletePaymentsServiceProvider,
    testUsers: TestUserService,
    components: ControllerComponents,
    settingsProvider: AllSettingsProvider,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with SettingsSurrogateKeySyntax
    with SafeLogging {

  import actionBuilders._

  def createSetupToken: Action[SetupTokenRequest] =
    PrivateAction.async(circe.json[SetupTokenRequest]) { implicit request =>
      val payPalCPService = getPayPalCPServiceForRequest(request)
      payPalCPService.createSetupToken
        .map { token => Ok(SetupTokenResponse(token).asJson) }
    }

  def createPaymentToken: Action[PaymentTokenRequest] =
    PrivateAction.async(circe.json[PaymentTokenRequest]) { implicit request =>
      val payPalCPService = getPayPalCPServiceForRequest(request)
      payPalCPService
        .createPaymentToken(request.body.setup_token)
        .map { token => Ok(PaymentTokenResponse(token.id, token.email).asJson) }
    }

  private def getPayPalCPServiceForRequest[T](request: Request[_]) = {
    val isTestUser = testUsers.isTestUser(request)
    payPalCPServiceProvider.forUser(isTestUser)
  }
}
