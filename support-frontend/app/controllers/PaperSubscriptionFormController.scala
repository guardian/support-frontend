package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.AssetsResolver
import com.gu.identity.model.{User => IdUser}
import com.gu.support.catalog.Paper
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.pricing.PriceSummaryServiceProvider
import config.RecaptchaConfigProvider
import play.api.mvc._
import play.twirl.api.Html
import services.TestUserService
import utils.PaperValidation
import views.EmptyDiv
import views.html.helper.CSRF
import views.html.subscriptionCheckout

import scala.concurrent.ExecutionContext

class PaperSubscriptionFormController(
  priceSummaryServiceProvider: PriceSummaryServiceProvider,
  val assets: AssetsResolver,
  val actionRefiners: CustomActionBuilders,
  testUsers: TestUserService,
  stripeConfigProvider: StripeConfigProvider,
  payPalConfigProvider: PayPalConfigProvider,
  components: ControllerComponents,
  settingsProvider: AllSettingsProvider,
  recaptchaConfigProvider: RecaptchaConfigProvider
)(implicit val ec: ExecutionContext) extends AbstractController(components) with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets


  def displayForm(): Action[AnyContent] = {
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    MaybeAuthenticatedAction { implicit request =>
      Ok(paperSubscriptionFormHtml(request.user)).withSettingsSurrogateKey
    }
  }

  private def paperSubscriptionFormHtml(maybeIdUser: Option[IdUser])(implicit request: RequestHeader, settings: AllSettings): Html = {
    val title = "Support the Guardian | Newspaper Subscription"
    val id = EmptyDiv("paper-subscription-checkout-page")
    val js = "paperSubscriptionCheckoutPage.js"
    val css = "paperSubscriptionCheckoutPage.css"
    val csrf = CSRF.getToken.value

    val uatMode = testUsers.isTestUser(request)
    val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
    val v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(isTestUser = uatMode).v2PublicKey

    subscriptionCheckout(
      title,
      id,
      js,
      css,
      Some(csrf),
      maybeIdUser,
      uatMode,
      priceSummaryServiceProvider.forUser(uatMode).getPrices(Paper, promoCodes),
      stripeConfigProvider.get(false),
      stripeConfigProvider.get(true),
      payPalConfigProvider.get(false),
      payPalConfigProvider.get(true),
      v2recaptchaConfigPublicKey,
      orderIsAGift = false,
      Some(PaperValidation.M25_POSTCODE_PREFIXES)
    )
  }


}
