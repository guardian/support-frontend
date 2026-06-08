package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath}
import cats.implicits._
import com.gu.monitoring.{SafeLogger, SafeLogging}
import play.api.libs.circe.Circe
import play.api.libs.json.{JsObject, JsString, JsValue, Json}
import play.api.mvc._
import services._
import views.EmptyDiv

import scala.concurrent.ExecutionContext
import scala.util.Try
import scala.concurrent.Future

class PayPalOneOff(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
    testUsers: TestUserService,
    components: ControllerComponents,
    paymentAPIService: PaymentAPIService,
    settingsProvider: AllSettingsProvider,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with SettingsSurrogateKeySyntax
    with SafeLogging {

  import actionBuilders._

  implicit val a: AssetsResolver = assets

  private val fallbackAcquisitionData: JsValue = JsObject(Seq("platform" -> JsString("SUPPORT")))

  def paypalError: Action[AnyContent] = PrivateAction { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    Ok(
      views.html.main(
        "Support the Guardian | PayPal Error",
        EmptyDiv("paypal-error-page"),
        RefPath("payPalErrorPage.js"),
        None,
      )(),
    ).withSettingsSurrogateKey
  }

  def processPayPalError(error: PayPalError)(implicit request: RequestHeader): Result = {
    if (error.errorName.contains("PAYMENT_ALREADY_DONE")) {
      logger.info(s"PAYMENT_ALREADY_DONE error code received. Sending user to thank-you page")
      Redirect("/contribute/one-off/thankyou")
    } else {
      Redirect(routes.PayPalOneOff.paypalError())
    }
  }

  def resultFromPaymentAPIError(
      error: PaymentAPIResponseError[PayPalError],
  )(implicit request: RequestHeader): Result = {
    error match {
      case PaymentAPIResponseError.APIError(err: PayPalError) => processPayPalError(err)
      case _ => Redirect(routes.PayPalOneOff.paypalError())
    }
  }

  def resultFromPaypalSuccess(success: PayPalSuccess, country: String, thankyou: String)(implicit
      request: RequestHeader,
  ): Result = {
    logger.info(s"One-off contribution for Paypal payment is successful")
    val redirect = Redirect(s"/$country/$thankyou")
    success.guestAccountCreationToken.fold {
      logger.info("Redirecting to thank you page without guestAccountCreationToken")
      redirect
    } { guestAccountCreationToken =>
      logger.info("Redirecting to thank you page with guestAccountCreationToken in flash session")
      redirect.flashing("guestAccountCreationToken" -> guestAccountCreationToken)
    }
  }

  def getAquisitionData(cookies: Cookies): JsValue = {
    (for {
      cookie <- cookies.get("acquisition_data")
      cookieAcquisitionData <- Try {
        val parsed = Json.parse(java.net.URLDecoder.decode(cookie.value, "UTF-8"))

        cookies.get("_ga") match {
          case Some(gaId) => parsed.as[JsObject] + ("gaId" -> Json.toJson(gaId.value))
          case None => parsed
        }
      }.toOption
    } yield cookieAcquisitionData).getOrElse(fallbackAcquisitionData)
  }

  def returnURL(
      paymentId: String,
      PayerID: String,
      email: String,
      country: String,
      thankyou: String,
  ): Action[AnyContent] =
    MaybeAuthenticatedActionOnFormSubmission.async { implicit request =>
      val acquisitionData = getAquisitionData(request.cookies)

      val paymentJSON = Json.obj(
        "paymentId" -> paymentId,
        "payerId" -> PayerID,
      )

      val similarProductsConsentCookie = request.cookies.get("gu_similar_products_consent")

      val similarProductsConsent = similarProductsConsentCookie.flatMap(_.value.toBooleanOption)

      val isTestUser = testUsers.isTestUser(request)
      val userAgent = request.headers.get("user-agent")

      paymentAPIService
        .executePaypalPayment(paymentJSON, acquisitionData, email, isTestUser, userAgent, similarProductsConsent)
        .fold(resultFromPaymentAPIError, success => resultFromPaypalSuccess(success, country, thankyou))
    }

  def stripeReturnURL(
      country: String,
      email: String,
      payment_intent: String,
      stripePublicKey: String,
      currency: String,
      amount: Double,
  ): Action[AnyContent] =
    MaybeAuthenticatedActionOnFormSubmission.async { implicit request =>
      val acquisitionData = getAquisitionData(request.cookies)

      val paymentDataJSON = Json.obj(
        "email" -> email,
        "currency" -> currency,
        "amount" -> amount,
      )

      val similarProductsConsentCookie = request.cookies.get("gu_similar_products_consent")

      val similarProductsConsent = similarProductsConsentCookie.flatMap(_.value.toBooleanOption)

      val isTestUser = testUsers.isTestUser(request)

      val userAgent = request.headers.get("user-agent")

      logger.info(s"stripeReturnURL ${request.uri}")

      paymentAPIService
        .completeStripePaypalPayment(
          payment_intent,
          paymentDataJSON,
          acquisitionData,
          stripePublicKey,
          isTestUser,
          userAgent,
          similarProductsConsent,
        )
        .fold(resultFromPaymentAPIError, success => resultFromPaypalSuccess(success, country, "thank-you"))
    }
}
