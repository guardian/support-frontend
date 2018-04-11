
package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import cats.implicits._
import com.gu.identity.play.{AuthenticatedIdUser, IdUser}
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.libs.circe.Circe
import play.api.libs.json.Json
import play.api.mvc._
import services.PaymentAPIService.Email
import services.{IdentityService, PaymentAPIService, TestUserService}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

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

  def returnURL(paymentId: String, PayerID: String): Action[AnyContent] = MaybeAuthenticatedAction.async { implicit request =>
    val maybeAcquisitionData = for {
      cookie <- request.cookies.get("acquisition_data")
      acquisitionData <- Try { Json.parse(java.net.URLDecoder.decode(cookie.value, "UTF-8")) }.toOption
    } yield acquisitionData

    val queryStrings = request.queryString
    val maybePaymentId = request.getQueryString("paymentId")
    val maybePayerId = request.getQueryString("PayerID")

    val paymentJSON = Json.obj(
      "paymentId" -> paymentId,
      "payerId" -> PayerID
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

    def emailForUser(user: AuthenticatedIdUser): Future[Option[String]] =
      identityService.getUser(user).value.map(_.toOption.map(_.primaryEmailAddress))

    val isTestUser = testUsers.isTestUser(testUsername.map(_.value))

    for {
      maybeEmail <- request.user.map(emailForUser).getOrElse(Future.successful(None))
      result <- paymentAPIService.execute(paymentJSON, maybeAcquisitionData, queryStrings, maybeEmail, isTestUser)
    } yield processPaymentApiResponse(result)

  }

  def cancelURL(): Action[AnyContent] = PrivateAction { implicit request =>
    SafeLogger.error(scrub"The user selected cancel payment and decided not to contribute.")
    Ok(views.html.react("Support the Guardian | PayPal Error", "paypal-error-page", "payPalErrorPage.js"))
  }
}
