package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.implicits._
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.catalog.Paper
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.pricing.PriceSummaryServiceProvider
import config.RecaptchaConfigProvider
import play.api.mvc._
import play.twirl.api.Html
import services.{IdentityService, TestUserService}
import utils.PaperValidation
import views.EmptyDiv
import views.html.helper.CSRF
import views.html.subscriptionCheckout

import scala.concurrent.{ExecutionContext, Future}

class PaperSubscriptionForm(
  priceSummaryServiceProvider: PriceSummaryServiceProvider,
  val assets: AssetsResolver,
  val actionRefiners: CustomActionBuilders,
  identityService: IdentityService,
  testUsers: TestUserService,
  stripeConfigProvider: StripeConfigProvider,
  payPalConfigProvider: PayPalConfigProvider,
  components: ControllerComponents,
  settingsProvider: AllSettingsProvider,
  fontLoaderBundle: Either[RefPath, StyleContent],
  recaptchaConfigProvider: RecaptchaConfigProvider
)(implicit val ec: ExecutionContext) extends AbstractController(components) with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets


  def displayForm(): Action[AnyContent] =
    authenticatedAction(subscriptionsClientId).async { implicit request =>
      implicit val settings: AllSettings = settingsProvider.getAllSettings()
      identityService.getUser(request.user.minimalUser).fold(
        error => {
          SafeLogger.error(scrub"Failed to display paper subscriptions form for ${request.user.minimalUser.id} due to error from identityService: $error")
          Future.successful(InternalServerError)
        },
        user => {
          Future.successful(Ok(paperSubscriptionFormHtml(user)))
        }
      ).flatten.map(_.withSettingsSurrogateKey)
    }

  private def paperSubscriptionFormHtml(idUser: IdUser)(implicit request: RequestHeader, settings: AllSettings): Html = {
    val title = "Support the Guardian | Newspaper Subscription"
    val id = EmptyDiv("paper-subscription-checkout-page")
    val js = "paperSubscriptionCheckoutPage.js"
    val css = "paperSubscriptionCheckoutPage.css"
    val csrf = CSRF.getToken.value
    val uatMode = testUsers.isTestUser(idUser.publicFields.displayName)
    val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
    val v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(isTestUser = uatMode).v2PublicKey

    subscriptionCheckout(
      title,
      id,
      js,
      css,
      fontLoaderBundle,
      Some(csrf),
      Some(idUser),
      uatMode,
      priceSummaryServiceProvider.forUser(uatMode).getPrices(Paper, promoCodes),
      stripeConfigProvider.get(false),
      stripeConfigProvider.get(true),
      payPalConfigProvider.get(false),
      payPalConfigProvider.get(true),
      v2recaptchaConfigPublicKey,
      false,
      Some(PaperValidation.M25_POSTCODE_PREFIXES)
    )
  }


}
