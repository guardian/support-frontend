
package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.identity.play.AuthenticatedIdUser
import play.api.libs.circe.Circe
import play.api.libs.json.{JsObject, JsString, JsValue, Json}
import play.api.mvc._
import services._
import cats.data.EitherT
import cats.implicits._
import com.gu.monitoring.SafeLogger
import monitoring.PathVerification.{OneOffContribution, PayPal, TipPath, monitoredRegion, verify}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try
import services.{IdentityService, PaymentAPIService, TestUserService}
import com.gu.tip.Tip
import views.EmptyDiv

class PayPalOneOff(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    testUsers: TestUserService,
    components: ControllerComponents,
    paymentAPIService: PaymentAPIService,
    identityService: IdentityService,
    settingsProvider: AllSettingsProvider,
    tipMonitoring: Tip,
    fontLoaderBundle: Either[RefPath, StyleContent]
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe with SettingsSurrogateKeySyntax {

  import actionBuilders._

  implicit val a: AssetsResolver = assets

  private val fallbackAcquisitionData: JsValue = JsObject(Seq("platform" -> JsString("SUPPORT")))

  def paypalError: Action[AnyContent] = PrivateAction { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    Ok(views.html.main(
      "Support the Guardian | PayPal Error",
      EmptyDiv("paypal-error-page"),
      Left(RefPath("payPalErrorPage.js")),
      Left(RefPath("payPalErrorPageStyles.css")),
      fontLoaderBundle
    )()).withSettingsSurrogateKey
  }

  def processPayPalError(error: PayPalError)(implicit request: RequestHeader): Result = {
    if (error.errorName.contains("PAYMENT_ALREADY_DONE")) {
      SafeLogger.info(s"PAYMENT_ALREADY_DONE error code received. Sending user to thank-you page")
      Redirect("/contribute/one-off/thankyou")
    } else {
      Redirect(routes.PayPalOneOff.paypalError())
    }
  }

  def resultFromPaymentAPIError(error: PaymentAPIResponseError[PayPalError])(implicit request: RequestHeader): Result = {
    error match {
      case PaymentAPIResponseError.APIError(err: PayPalError) => processPayPalError(err)
      case _ => Redirect(routes.PayPalOneOff.paypalError())
    }
  }

  def resultFromPaypalSuccess(success: PayPalSuccess, country: String, isTestUser: Boolean)(implicit request: RequestHeader): Result = {
    SafeLogger.info(s"One-off contribution for Paypal payment is successful")
    val redirect = Redirect(s"/$country/thankyou")
    if (!isTestUser) {
      monitoredRegion(country).map {
        region => verify(TipPath(region, OneOffContribution, PayPal), tipMonitoring.verify)
      }
    }
    success.email.fold({
      SafeLogger.info("Redirecting to thank you page without email in flash session")
      redirect
    })({ email =>
      SafeLogger.info("Redirecting to thank you page with email in flash session")
      redirect.flashing("email" -> email)
    })
  }

  def returnURL(paymentId: String, PayerID: String, email: String, country: String): Action[AnyContent] = maybeAuthenticatedAction().async { implicit request =>

    val acquisitionData = (for {
      cookie <- request.cookies.get("acquisition_data")
      cookieAcquisitionData <- Try {
        val parsed = Json.parse(java.net.URLDecoder.decode(cookie.value, "UTF-8"))

        request.cookies.get("_ga") match {
          case Some(gaId) => parsed.as[JsObject] + ("gaId" -> Json.toJson(gaId.value))
          case None => parsed
        }
      }.toOption
    } yield cookieAcquisitionData).getOrElse(fallbackAcquisitionData)

    val paymentJSON = Json.obj(
      "paymentId" -> paymentId,
      "payerId" -> PayerID
    )

    val queryStrings = request.queryString
    val testUsername = request.cookies.get("_test_username")
    val isTestUser = testUsers.isTestUser(testUsername.map(_.value))
    val userAgent = request.headers.get("user-agent")

    paymentAPIService.executePaypalPayment(paymentJSON, acquisitionData, queryStrings, email, isTestUser, userAgent)
      .fold(resultFromPaymentAPIError, success => resultFromPaypalSuccess(success, country, isTestUser))
  }
}
