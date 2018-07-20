
package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import com.gu.identity.play.AuthenticatedIdUser
import io.circe.syntax._
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.libs.circe.Circe
import play.api.mvc._
import play.libs.Json
import services.paypal.PayPalBillingDetails.codec
import services.paypal.{PayPalBillingDetails, PayPalNvpServiceProvider, Token}
import services.{PayPalNvpService, TestUserService}
import switchboard.Switches

import scala.concurrent.ExecutionContext

class PayPalRegular(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    payPalNvpServiceProvider: PayPalNvpServiceProvider,
    testUsers: TestUserService,
    components: ControllerComponents,
    switches: Switches
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe {

  import actionBuilders._

  implicit val assetsResolver = assets
  implicit val sw = switches

  def testUser[A](request: CustomActionBuilders.OptionalAuthRequest[A]): Boolean = {
    val userName = request.user.map(user => user.user.displayName).getOrElse(request.cookies.get("_test_username").map(_.value))
    testUsers.isTestUser(userName)
  }

  // Sets up a payment by contacting PayPal, returns the token as JSON.
  def setupPayment: Action[PayPalBillingDetails] = maybeAuthenticatedAction().async(circe.json[PayPalBillingDetails]) { implicit request =>
    val paypalBillingDetails = request.body
    val isTestUser = testUser(request)
    print(isTestUser)
    withPaypalServiceForUser(isTestUser) { service =>
      service.retrieveToken(
        returnUrl = routes.PayPalRegular.returnUrl().absoluteURL(secure = true),
        cancelUrl = routes.PayPalRegular.cancelUrl().absoluteURL(secure = true)
      )(paypalBillingDetails)
    }.map { response =>
      {
        Ok(Token(response).asJson)
      }

    }
  }

  def createAgreement: Action[Token] = maybeAuthenticatedAction().async(circe.json[Token]) { implicit request =>
    val isTestUser = testUser(request)
    withPaypalServiceForUser(isTestUser) { service =>
      service.createBillingAgreement(request.body)
    }.map(token => Ok(Token(token).asJson))
  }

  private def withPaypalServiceForUser[T](isTestUser: Boolean)(fn: PayPalNvpService => T): T = {
    val service = payPalNvpServiceProvider.forUser(isTestUser)
    fn(service)
  }

  // The endpoint corresponding to the PayPal return url, hit if the user is
  // redirected and needs to come back.
  def returnUrl: Action[AnyContent] = PrivateAction { implicit request =>
    SafeLogger.error(scrub"User hit the PayPal returnUrl.")
    Ok(views.html.main(
      "Support the Guardian | PayPal Error",
      "paypal-error-page",
      "payPalErrorPage.js",
      "payPalErrorPageStyles.css"
    ))
  }

  // The endpoint corresponding to the PayPal cancel url, hit if the user is
  // redirected and the payment fails.
  def cancelUrl: Action[AnyContent] = PrivateAction { implicit request =>
    SafeLogger.error(scrub"User hit the PayPal cancelUrl, something went wrong.")
    Ok(views.html.main(
      "Support the Guardian | PayPal Error",
      "paypal-error-page",
      "payPalErrorPage.js",
      "payPalErrorPageStyles.css"
    ))
  }
}
