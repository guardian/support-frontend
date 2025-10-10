package controllers

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath}
import com.gu.monitoring.SafeLogging
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import services.{PayPalNvpService, TestUserService}
import services.paypal.{PayPalBillingDetails, PayPalNvpServiceProvider, Token}
import views.EmptyDiv

import scala.concurrent.ExecutionContext

case class CreateSetupToken()

object CreateSetupToken {
  implicit val codec: Codec[CreateSetupToken] = deriveCodec
}

class PayPalCompletePayments(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    payPalNvpServiceProvider: PayPalNvpServiceProvider,
    testUsers: TestUserService,
    components: ControllerComponents,
    settingsProvider: AllSettingsProvider,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with SettingsSurrogateKeySyntax
    with SafeLogging {

  import actionBuilders._

  // Sets up a payment by contacting PayPal, returns the token as JSON.
  def setupPayment: Action[CreateSetupToken] =
    MaybeAuthenticatedActionOnFormSubmission.async(circe.json[CreateSetupToken]) { implicit request =>
      val payPalCPService = getPayPalCPServiceForRequest(request)
      service.createSetupToken().map { maybeToken =>
        maybeToken
          .map(s => Ok(SetupToken(s).asJson))
          .getOrElse(BadRequest("We were unable to set up a payment for this request (missing PayPal token)"))
      }
    }
  }

  private def getPayPalCPServiceForRequest[T](request: OptionalAuthRequest[_]) = {
    val isTestUser = testUsers.isTestUser(request)
    payPalCPServiceProvider.forUser(isTestUser)
  }
}
