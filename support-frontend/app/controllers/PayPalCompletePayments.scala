package controllers

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath}
import com.gu.monitoring.SafeLogging
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.syntax.EncoderOps
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents, Request}
import services.{PayPalNvpService, TestUserService}
import services.paypal.{PayPalBillingDetails, PayPalCompletePaymentsServiceProvider, PayPalNvpServiceProvider, Token}
import views.EmptyDiv

import scala.concurrent.ExecutionContext

case class CreateSetupToken()
object CreateSetupToken {
  implicit val codec: Codec[CreateSetupToken] = deriveCodec
}

case class CreatePaymentToken(setup_token: String)
object CreatePaymentToken {
  implicit val codec: Codec[CreatePaymentToken] = deriveCodec
}

case class SetupToken(token: String)
object SetupToken {
  implicit val codec: Codec[SetupToken] = deriveCodec
}

case class PaymentToken(token: String, email: String)
object PaymentToken {
  implicit val codec: Codec[PaymentToken] = deriveCodec
}

class PayPalCompletePayments(
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

  def createSetupToken: Action[CreateSetupToken] =
    PrivateAction.async(circe.json[CreateSetupToken]) { implicit request =>
      val payPalCPService = getPayPalCPServiceForRequest(request)
      payPalCPService.createSetupToken
        .map { token => Ok(SetupToken(token).asJson) }
    }

  def createPaymentToken: Action[CreatePaymentToken] =
    PrivateAction.async(circe.json[CreatePaymentToken]) { implicit request =>
      val payPalCPService = getPayPalCPServiceForRequest(request)
      payPalCPService
        .createPaymentToken(request.body.setup_token)
        .map { token => Ok(PaymentToken(token.id, token.email).asJson) }
    }

  private def getPayPalCPServiceForRequest[T](request: Request[_]) = {
    val isTestUser = testUsers.isTestUser(request)
    payPalCPServiceProvider.forUser(isTestUser)
  }
}
