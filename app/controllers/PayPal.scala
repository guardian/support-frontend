
package controllers

import actions.CustomActionBuilders
import actions.CustomActionBuilders.AuthRequest
import assets.AssetsResolver
import com.gu.identity.play.AuthenticatedIdUser
import com.typesafe.scalalogging.LazyLogging
import play.api.libs.json.Json.toJson
import play.api.libs.json._
import play.api.mvc._
import services.paypal.{PayPalBillingDetails, PayPalServiceProvider, Token}
import services.{PayPalService, TestUserService}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{ExecutionContext, Future}

class PayPal(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    payPalServiceProvider: PayPalServiceProvider,
    testUsers: TestUserService,
    components: ControllerComponents
)(implicit val ec: ExecutionContext) extends AbstractController(components) with LazyLogging {

  import actionBuilders._

  implicit val assetsResolver = assets

  // Json readers & writers.
  implicit val formatsToken = Json.format[Token]
  implicit val readsBillingDetails = Json.reads[PayPalBillingDetails]

  // Sets up a payment by contacting PayPal, returns the token as JSON.
  def setupPayment: Action[PayPalBillingDetails] = AuthenticatedAction.async(parse.json[PayPalBillingDetails]) { implicit request =>
    val paypalBillingDetails = request.body

    withPaypalServiceForUser(request.user) { service =>
      service.retrieveToken(
        returnUrl = routes.PayPal.returnUrl().absoluteURL(secure = true),
        cancelUrl = routes.PayPal.cancelUrl().absoluteURL(secure = true)
      )(paypalBillingDetails)
    }.map { response =>
      Ok(toJson(Token(response)))
    }
  }

  def createAgreement: Action[Token] = AuthenticatedAction.async(parse.json[Token]) { implicit request =>
    withPaypalServiceForUser(request.user) { service =>
      service.retrieveBaid(request.body)
    }.map(token => Ok(toJson(Token(token))))
  }

  private def withPaypalServiceForUser[T](user: AuthenticatedIdUser)(fn: PayPalService => T): T = {
    val service = payPalServiceProvider.forUser(testUsers.isTestUser(user))
    fn(service)
  }

  // The endpoint corresponding to the PayPal return url, hit if the user is
  // redirected and needs to come back.
  def returnUrl: Action[AnyContent] = PrivateAction {
    logger.error("User hit the PayPal returnUrl.")
    Ok(views.html.react("Support the Guardian | PayPal Error", "paypal-error-page", "payPalErrorPage.js"))
  }

  // The endpoint corresponding to the PayPal cancel url, hit if the user is
  // redirected and the payment fails.
  def cancelUrl: Action[AnyContent] = PrivateAction {
    logger.error("User hit the PayPal cancelUrl, something went wrong.")
    Ok(views.html.react("Support the Guardian | PayPal Error", "paypal-error-page", "payPalErrorPage.js"))
  }
}
