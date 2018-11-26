
package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import com.gu.identity.play.AuthenticatedIdUser
import play.api.libs.circe.Circe
import play.api.libs.json.{JsObject, JsString, JsValue, Json}
import play.api.mvc._
import services._
import cats.data.EitherT
import cats.implicits._
import monitoring.SafeLogger
import monitoring.PathVerification.{TipPath, PayPal, OneOffContribution, monitoredRegion, verify}
import admin.{Settings, SettingsProvider, SettingsSurrogateKeySyntax}
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try
import services.{IdentityService, PaymentAPIService, TestUserService}
import com.gu.tip.Tip

class PayPalOneOff(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    testUsers: TestUserService,
    components: ControllerComponents,
    paymentAPIService: PaymentAPIService,
    identityService: IdentityService,
    settingsProvider: SettingsProvider,
    tipMonitoring: Tip
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe with SettingsSurrogateKeySyntax {

  import actionBuilders._

  implicit val a: AssetsResolver = assets

  private val fallbackAcquisitionData: JsValue = JsObject(Seq("platform" -> JsString("SUPPORT")))

  def paypalError: Action[AnyContent] = PrivateAction { implicit request =>
    implicit val settings: Settings = settingsProvider.settings()
    Ok(views.html.main(
      "Support the Guardian | PayPal Error",
      "paypal-error-page",
      "payPalErrorPage.js",
      "payPalErrorPageStyles.css"
    )).withSettingsSurrogateKey
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

  def resultFromPaypalSuccess(success: PayPalSuccess, country: Option[String], isTestUser: Boolean)(implicit request: RequestHeader): Result = {
    SafeLogger.info(s"One-off contribution for Paypal payment is successful")
    val redirect = Redirect {
      country match {
        // TODO: more cleanup
        case Some(c) => s"/$c/thankyou"
        case None => "/contribute/one-off/thankyou"
      }
    }
    if (!isTestUser) {
      monitoredRegion(country.getOrElse("Unknown")).map {
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

  //TODO - more cleanup
  def newReturnURL(paymentId: String, PayerID: String, country: String): Action[AnyContent] = returnURL(paymentId, PayerID, Some(country))

  def returnURL(paymentId: String, PayerID: String, country: Option[String] = None): Action[AnyContent] = maybeAuthenticatedAction().async { implicit request =>

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

    def emailForUser(user: Option[AuthenticatedIdUser])(
      implicit
      request: RequestHeader
    ): EitherT[Future, PaymentAPIResponseError[PayPalError], Option[String]] = {

      val noEmail = EitherT.pure[Future, PaymentAPIResponseError[PayPalError]](Option.empty[String])

      user.fold(noEmail) { authUser =>
        identityService.getUser(authUser)
          .map(idUser => Option(idUser.primaryEmailAddress))
          .leftFlatMap(_ => noEmail)
      }
    }

    emailForUser(request.user)
      .flatMap(paymentAPIService.executePaypalPayment(paymentJSON, acquisitionData, queryStrings, _, isTestUser, userAgent))
      .fold(resultFromPaymentAPIError, success => resultFromPaypalSuccess(success, country, isTestUser))
  }

  def cancelURL(): Action[AnyContent] = PrivateAction { implicit request =>
    SafeLogger.info("The user selected cancel payment and decided not to contribute.")
    Redirect(routes.PayPalOneOff.paypalError())
  }
}
