
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
import services.paypal.{PayPalBillingDetails, PayPalNvpServiceProvider, Token}
import services.{PaymentAPIService, PayPalNvpService, TestUserService}
import services.PaymentAPIService.Email
import scala.concurrent.ExecutionContext

class PayPalRest(
    actionBuilders: CustomActionBuilders,
    assets: AssetsResolver,
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

  def returnURL(): Action[AnyContent] = PrivateAction.async { implicit request =>

    PaymentAPIService.execute(request).map { success =>
      if (success)
        Redirect("/contribute/one-off/thankyou")
      else {
        SafeLogger.error(scrub"Error making paypal payment")
        Ok(views.html.react("Support the Guardian | PayPal Error", "paypal-error-page", "payPalErrorPage.js"))
      }
    }
  }

  def cancelURL(): Action[AnyContent] = ???
}
