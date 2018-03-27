
package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import com.gu.identity.play.AuthenticatedIdUser
import io.circe.syntax._
import cats.implicits._
import monitoring.SafeLogger._
import monitoring.SafeLogger
import play.api.libs.circe.Circe
import play.api.mvc._
import services.paypal.PayPalBillingDetails.codec
import services.paypal.{PayPalBillingDetails, PayPalServiceProvider, Token}
import services.{PaymentAPIService, PayPalService, TestUserService}
import services.PaymentAPIService.Email
import scala.concurrent.ExecutionContext

class PayPalRest(
  actionBuilders: CustomActionBuilders,
  assets: AssetsResolver,
  payPalServiceProvider: PayPalServiceProvider,
  testUsers: TestUserService,
  components: ControllerComponents,
  PaymentAPIService: PaymentAPIService
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe {

  import actionBuilders._

  implicit val assetsResolver = assets

  def resultFromEmailOption(email: Option[Email]): Result = {
    val redirect = Redirect("/contribute/one-off/thankyou")
    email.fold(redirect)(e => {
      SafeLogger.info("Redirecting to thank you page with email in flash session")
      redirect.flashing("email" -> e.value)
    })
  }

  def execute(): Action[AnyContent] = PrivateAction.async { implicit request =>
    PaymentAPIService.execute(request).fold(
      e => {
        SafeLogger.error(scrub"Error making paypal payment", e)
        Ok(views.html.react("Support the Guardian | PayPal Error", "paypal-error-page", "payPalErrorPage.js"))
      },
      resultFromEmailOption
    )
  }
}
