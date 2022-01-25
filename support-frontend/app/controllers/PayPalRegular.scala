
package controllers

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import io.circe.syntax._
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.paypal.PayPalBillingDetails.codec
import services.paypal.{PayPalBillingDetails, PayPalNvpServiceProvider, Token}
import services.{PayPalNvpService, TestUserService}
import views.EmptyDiv

import scala.concurrent.ExecutionContext

class PayPalRegular(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    payPalNvpServiceProvider: PayPalNvpServiceProvider,
    testUsers: TestUserService,
    components: ControllerComponents,
    settingsProvider: AllSettingsProvider
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe with SettingsSurrogateKeySyntax {

  import actionBuilders._

  implicit val a: AssetsResolver = assets

  // Sets up a payment by contacting PayPal, returns the token as JSON.
  def setupPayment: Action[PayPalBillingDetails] = MaybeAuthenticatedAction.async(circe.json[PayPalBillingDetails]) { implicit request =>
    val paypalBillingDetails = request.body
    withPaypalServiceForRequest(request) { service =>
      service.retrieveToken(
        returnUrl = routes.PayPalRegular.returnUrl().absoluteURL(secure = true),
        cancelUrl = routes.PayPalRegular.cancelUrl().absoluteURL(secure = true)
      )(paypalBillingDetails)
    }.map { maybeString =>
      maybeString
        .map(s => Ok(Token(s).asJson))
        .getOrElse(BadRequest("We were unable to set up a payment for this request (missing PayPal token)"))
    }
  }

  def createAgreement: Action[Token] = MaybeAuthenticatedAction.async(circe.json[Token]) { implicit request =>
    withPaypalServiceForRequest(request) { service =>
      service.createBillingAgreement(request.body)
    }.map { maybeString =>
      maybeString
        .map(s => Ok(Token(s).asJson))
        .getOrElse(BadRequest("We were unable to create an agreement for this request (missing PayPal token)"))
    }
  }

  def createAgreementAndRetrieveUser: Action[Token] = MaybeAuthenticatedAction.async(circe.json[Token]) { implicit request =>
    withPaypalServiceForRequest(request) { service =>
      service.createAgreementAndRetrieveUser(request.body)
    }.map { maybePayPalCheckoutDetails =>
      maybePayPalCheckoutDetails
        .map(details => Ok(details.asJson))
        .getOrElse(BadRequest("We were unable to create an agreement for this request (missing user details or baid)"))
    }
  }

  private def withPaypalServiceForRequest[T](request: OptionalAuthRequest[_])(fn: PayPalNvpService => T): T = {
    val isTestUser = testUsers.isTestUser(request)
    val service = payPalNvpServiceProvider.forUser(isTestUser)
    fn(service)
  }

  // The endpoint corresponding to the PayPal return url, hit if the user is
  // redirected and needs to come back.
  def returnUrl: Action[AnyContent] = PrivateAction { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    SafeLogger.error(scrub"User hit the PayPal returnUrl.")
    Ok(views.html.main(
      "Support the Guardian | PayPal Error",
      EmptyDiv("paypal-error-page"),
      Left(RefPath("payPalErrorPage.js")),
      Left(RefPath("payPalErrorPageStyles.css"))
    )()).withSettingsSurrogateKey
  }

  // The endpoint corresponding to the PayPal cancel url, hit if the user is
  // redirected and the payment fails.
  def cancelUrl: Action[AnyContent] = PrivateAction { implicit request =>
    SafeLogger.error(scrub"User hit the PayPal cancelUrl, something went wrong.")
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    Ok(views.html.main(
      "Support the Guardian | PayPal Error",
      EmptyDiv("paypal-error-page"),
      Left(RefPath("payPalErrorPage.js")),
      Left(RefPath("payPalErrorPageStyles.css"))
    )()).withSettingsSurrogateKey
  }
}
