
package controllers

import actions.CustomActionBuilders
import actions.CustomActionBuilders.AuthRequest
import assets.AssetsResolver
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

  // Json readers & writers.
  implicit val formatsToken = Json.format[Token]
  implicit val readsBillingDetails = Json.reads[PayPalBillingDetails]

  // Sets up a payment by contacting PayPal, returns the token as JSON.
  def setupPayment: Action[PayPalBillingDetails] = AuthenticatedAction.async(parse.json[PayPalBillingDetails]) { implicit request =>
    readRequestAndRunServiceCall(_.retrieveToken(
      returnUrl = routes.PayPal.returnUrl().absoluteURL(secure = true),
      cancelUrl = routes.PayPal.cancelUrl().absoluteURL(secure = true)
    ))
  }

  // Creates a billing agreement using a payment token.
  def createAgreement: Action[Token] = AuthenticatedAction.async(parse.json[Token]) { implicit request =>
    readRequestAndRunServiceCall(_.retrieveBaid)
  }

  //Takes a request with a body of type [T], then passes T to the payPal call 'exec' to retrieve a token and returns this as json
  private def readRequestAndRunServiceCall[T](exec: (PayPalService) => ((T) => Future[String]))(implicit request: AuthRequest[T]) = {
    for {
      token <- exec(payPalServiceProvider.forUser(testUsers.isTestUser))(request.body)
    } yield Ok(toJson(Token(token)))
  }

  // The endpoint corresponding to the PayPal return url, hit if the user is
  // redirected and needs to come back.
  def returnUrl: Action[AnyContent] = PrivateAction {
    logger.error("User hit the PayPal returnUrl.")
    Ok("views.html.paypal.errorPage()") //TODO: client side sentry?
  }

  // The endpoint corresponding to the PayPal cancel url, hit if the user is
  // redirected and the payment fails.
  def cancelUrl: Action[AnyContent] = PrivateAction {
    logger.error("User hit the PayPal cancelUrl, something went wrong.")
    Ok("views.html.paypal.errorPage()") //TODO: client side sentry?
  }
}
