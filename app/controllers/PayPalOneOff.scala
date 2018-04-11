
package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import cats.implicits._
import com.gu.identity.play.IdUser
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.libs.circe.Circe
import play.api.libs.json.Json
import play.api.mvc._
import services.PaymentAPIService.Email
import services.{IdentityService, PaymentAPIService, TestUserService}

import scala.concurrent.{ExecutionContext, Future}

class PayPalOneOff(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    testUsers: TestUserService,
    components: ControllerComponents,
    paymentAPIService: PaymentAPIService,
    identityService: IdentityService
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe {

  import actionBuilders._

  implicit val assetsResolver = assets

  def resultFromEmailOption(email: Option[Email]): Result = {
    val redirect = Redirect("/contribute/one-off/thankyou")
    email.fold(redirect)({ e =>
      SafeLogger.info("Redirecting to thank you page with email in flash session")
      redirect.flashing("email" -> e.value)
    })
  }

  def returnURL(): Action[AnyContent] = MaybeAuthenticatedAction.async { implicit request =>
    val cookieString = request.cookies.get("acquisition_data").get.value
    val acquisitionData = Json.parse(java.net.URLDecoder.decode(cookieString, "UTF-8"))
    val queryStrings = request.queryString
    val paymentJSON = Json.obj(
      "paymentId" -> request.getQueryString("paymentId").get,
      "payerId" -> request.getQueryString("PayerID").get
    )
    val testUsername = request.cookies.get("_test_username");

    def processPaymentApiResponse(success: Boolean): Result = {
      if (success)
        Redirect("/contribute/one-off/thankyou")
      else {
        SafeLogger.error(scrub"Error making paypal payment")
        Ok(views.html.react("Support the Guardian | PayPal Error", "paypal-error-page", "payPalErrorPage.js"))
      }
    }

    val maybeEmail: Future[Option[String]] =
      request.user.map { minimalUser =>
        identityService.getUser(minimalUser).value.map(_.toOption.map(_.primaryEmailAddress))
      }.getOrElse(Future.successful(None))

    val isTestUser = testUsers.isTestUser(testUsername.map(_.value))

    maybeEmail.flatMap(email => paymentAPIService.execute(paymentJSON, acquisitionData, queryStrings, email, isTestUser).map(processPaymentApiResponse))

  }

  def cancelURL(): Action[AnyContent] = PrivateAction { implicit request =>
    SafeLogger.error(scrub"The user selected cancel payment and decided not to contribute.")
    Ok(views.html.react("Support the Guardian | PayPal Error", "paypal-error-page", "payPalErrorPage.js"))
  }
}
