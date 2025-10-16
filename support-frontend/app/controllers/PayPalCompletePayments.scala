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
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import services.{PayPalNvpService, TestUserService}
import services.paypal.{PayPalBillingDetails, PayPalCompletePaymentsServiceProvider, PayPalNvpServiceProvider, Token}
import views.EmptyDiv

import scala.concurrent.ExecutionContext

case class CreateSetupToken()

object CreateSetupToken {
  implicit val codec: Codec[CreateSetupToken] = deriveCodec
}

case class SetupToken(token: String)

object SetupToken {
  implicit val codec: Codec[SetupToken] = deriveCodec
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
    MaybeAuthenticatedActionOnFormSubmission.async(circe.json[CreateSetupToken]) { implicit request =>
      val payPalCPService = getPayPalCPServiceForRequest(request)
      payPalCPService.createSetupToken
        .map { token => Ok(SetupToken(token).asJson) }
    }

  private def getPayPalCPServiceForRequest[T](request: OptionalAuthRequest[_]) = {
    val isTestUser = testUsers.isTestUser(request)
    payPalCPServiceProvider.forUser(isTestUser)
  }
}
