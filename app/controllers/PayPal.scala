
package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import com.gu.identity.play.AuthenticatedIdUser
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax._
import cats.implicits._
import monitoring.SentryLogging
import play.api.libs.circe.Circe
import play.api.mvc._
import services.paypal.PayPalBillingDetails.codec
import services.paypal.{PayPalBillingDetails, PayPalServiceProvider, Token}
import services.{ContributionsFrontendService, PayPalService, TestUserService}
import services.ContributionsFrontendService.Email

import scala.concurrent.ExecutionContext
import scala.concurrent.ExecutionContext.Implicits.global

class PayPal(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    payPalServiceProvider: PayPalServiceProvider,
    testUsers: TestUserService,
    components: ControllerComponents,
    contributionsFrontendService: ContributionsFrontendService
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe with LazyLogging {

  import actionBuilders._

  implicit val assetsResolver = assets

  // Sets up a payment by contacting PayPal, returns the token as JSON.
  def setupPayment: Action[PayPalBillingDetails] = AuthenticatedAction.async(circe.json[PayPalBillingDetails]) { implicit request =>
    val paypalBillingDetails = request.body

    withPaypalServiceForUser(request.user) { service =>
      service.retrieveToken(
        returnUrl = routes.PayPal.returnUrl().absoluteURL(secure = true),
        cancelUrl = routes.PayPal.cancelUrl().absoluteURL(secure = true)
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

  def resultFromEmailOption(email: Option[Email]): Result = {
    val redirect = Redirect("/contribute/one-off/thankyou")
    email.fold(redirect)(e => {
      logger.info("Redirecting to thank you page with email in flash session")
      redirect.flashing("email" -> e.value)
    })
  }

  def execute(): Action[AnyContent] = PrivateAction.async { implicit request =>
    contributionsFrontendService.execute(request).fold(
      err => {
        logger.error(SentryLogging.noPii, s"Error making paypal payment: " + err.getCause)
        Ok(views.html.react("Support the Guardian | PayPal Error", "paypal-error-page", "payPalErrorPage.js"))
      },
      resultFromEmailOption
    )
  }

  private def withPaypalServiceForUser[T](user: AuthenticatedIdUser)(fn: PayPalService => T): T = {
    val service = payPalServiceProvider.forUser(testUsers.isTestUser(user))
    fn(service)
  }

  // The endpoint corresponding to the PayPal return url, hit if the user is
  // redirected and needs to come back.
  def returnUrl: Action[AnyContent] = PrivateAction { implicit request =>
    logger.error(SentryLogging.noPii, "User hit the PayPal returnUrl.")
    Ok(views.html.react("Support the Guardian | PayPal Error", "paypal-error-page", "payPalErrorPage.js"))
  }

  // The endpoint corresponding to the PayPal cancel url, hit if the user is
  // redirected and the payment fails.
  def cancelUrl: Action[AnyContent] = PrivateAction { implicit request =>
    logger.error(SentryLogging.noPii, "User hit the PayPal cancelUrl, something went wrong.")
    Ok(views.html.react("Support the Guardian | PayPal Error", "paypal-error-page", "payPalErrorPage.js"))
  }
}
