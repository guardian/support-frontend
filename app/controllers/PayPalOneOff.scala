
package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import cats.implicits._
import com.gu.identity.play.{AuthenticatedIdUser, IdUser}
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.libs.circe.Circe
import play.api.libs.json.{JsObject, JsString, JsValue, Json}
import play.api.mvc._

import services.PaymentAPIService.Email
import services.{IdentityService, PaymentAPIService, TestUserService}
import admin.{Settings, SettingsProvider}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

class PayPalOneOff(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    testUsers: TestUserService,
    components: ControllerComponents,
    paymentAPIService: PaymentAPIService,
    identityService: IdentityService,
    settingsProvider: SettingsProvider
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe {

  import actionBuilders._

  implicit val a: AssetsResolver = assets

  def resultFromEmailOption(email: Option[Email]): Result = {
    val redirect = Redirect("/contribute/one-off/thankyou")
    email.fold(redirect)({ e =>
      SafeLogger.info("Redirecting to thank you page with email in flash session")
      redirect.flashing("email" -> e.value)
    })
  }

  private val fallbackAcquisitionData: JsValue = JsObject(Seq("platform" -> JsString("SUPPORT")))

  def returnURL(paymentId: String, PayerID: String): Action[AnyContent] = maybeAuthenticatedAction().async { implicit request =>
    implicit val settings: Settings = settingsProvider.settings()

    val acquisitionData = (for {
      cookie <- request.cookies.get("acquisition_data")
      cookieAcquisitionData <- Try { Json.parse(java.net.URLDecoder.decode(cookie.value, "UTF-8")) }.toOption
    } yield cookieAcquisitionData).getOrElse(fallbackAcquisitionData)

    val paymentJSON = Json.obj(
      "paymentId" -> paymentId,
      "payerId" -> PayerID
    )

    def processPaymentApiResponse(success: Boolean): Result = {
      if (success) {
        SafeLogger.info(s"One-off contribution for Paypal payment is successful. Sending user to thank-you page")
        Redirect("/contribute/one-off/thankyou")
      } else {
        SafeLogger.error(scrub"Error making paypal payment. Sending user to error page.")
        Ok(views.html.main(
          "Support the Guardian | PayPal Error",
          "paypal-error-page",
          "payPalErrorPage.js",
          "payPalErrorPageStyles.css"
        ))
      }
    }

    def emailForUser(user: AuthenticatedIdUser): Future[Option[String]] =
      identityService.getUser(user).value.map(_.toOption.map(_.primaryEmailAddress))

    val queryStrings = request.queryString
    val testUsername = request.cookies.get("_test_username");
    val isTestUser = testUsers.isTestUser(testUsername.map(_.value))

    for {
      maybeEmail <- request.user.map(emailForUser).getOrElse(Future.successful(None))
      result <- paymentAPIService.executePaypalPayment(paymentJSON, acquisitionData, queryStrings, maybeEmail, isTestUser)
    } yield processPaymentApiResponse(result)

  }

  def cancelURL(): Action[AnyContent] = PrivateAction { implicit request =>
    SafeLogger.info("The user selected cancel payment and decided not to contribute.")
    implicit val settings: Settings = settingsProvider.settings()
    Ok(views.html.main(
      "Support the Guardian | PayPal Error",
      "paypal-error-page",
      "payPalErrorPage.js",
      "payPalErrorPageStyles.css"
    ))
  }
}
