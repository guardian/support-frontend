
package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import com.gu.identity.play.AuthenticatedIdUser
import io.circe.syntax._
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.paypal.PayPalBillingDetails.codec
import services.paypal.{PayPalBillingDetails, PayPalNvpServiceProvider, Token}
import services.{PayPalNvpService, TestUserService}

import scala.concurrent.ExecutionContext

class PayPalRegular(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    payPalNvpServiceProvider: PayPalNvpServiceProvider,
    testUsers: TestUserService,
    components: ControllerComponents
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe {

  import actionBuilders._

  implicit val assetsResolver = assets

  // Sets up a payment by contacting PayPal, returns the token as JSON.
  def setupPayment: Action[PayPalBillingDetails] = AuthenticatedAction.async(circe.json[PayPalBillingDetails]) { implicit request =>
    val paypalBillingDetails = request.body

    withPaypalServiceForUser(request.user) { service =>
      service.retrieveToken(
        returnUrl = routes.PayPalRegular.returnUrl().absoluteURL(secure = true),
        cancelUrl = routes.PayPalRegular.cancelUrl().absoluteURL(secure = true)
      )(paypalBillingDetails)
    }.map { response =>
      Ok(Token(response).asJson)
    }
  }

  def createAgreement: Action[Token] = AuthenticatedAction.async(circe.json[Token]) { implicit request =>
    withPaypalServiceForUser(request.user) { service =>
      service.createBillingAgreement(request.body)
    }.map(token => Ok(Token(token).asJson))
  }

  private def withPaypalServiceForUser[T](user: AuthenticatedIdUser)(fn: PayPalNvpService => T): T = {
    val service = payPalNvpServiceProvider.forUser(testUsers.isTestUser(user))
    fn(service)
  }

  // The endpoint corresponding to the PayPal return url, hit if the user is
  // redirected and needs to come back.
  def returnUrl: Action[AnyContent] = PrivateAction { implicit request =>
    SafeLogger.error(scrub"User hit the PayPal returnUrl.")
    Ok(views.html.react("Support the Guardian | PayPal Error", "paypal-error-page", "payPalErrorPage.js"))
  }

  // The endpoint corresponding to the PayPal cancel url, hit if the user is
  // redirected and the payment fails.
  def cancelUrl: Action[AnyContent] = PrivateAction { implicit request =>
    SafeLogger.error(scrub"User hit the PayPal cancelUrl, something went wrong.")
    Ok(views.html.react("Support the Guardian | PayPal Error", "paypal-error-page", "payPalErrorPage.js"))
  }
}
