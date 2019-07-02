package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.implicits._
import com.gu.googleauth.AuthAction
import com.gu.identity.play.IdUser
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.pricing.PriceSummaryServiceProvider
import config.StringsConfig
import play.api.libs.circe.Circe
import play.api.mvc._
import play.twirl.api.Html
import services.{IdentityService, TestUserService}
import views.EmptyDiv
import views.html.helper.CSRF
import views.html.subscriptionCheckout

import scala.concurrent.{ExecutionContext, Future}

class WeeklySubscription(
  authAction: AuthAction[AnyContent],
  priceSummaryServiceProvider: PriceSummaryServiceProvider,
  val assets: AssetsResolver,
  val actionRefiners: CustomActionBuilders,
  identityService: IdentityService,
  testUsers: TestUserService,
  stripeConfigProvider: StripeConfigProvider,
  payPalConfigProvider: PayPalConfigProvider,
  components: ControllerComponents,
  stringsConfig: StringsConfig,
  settingsProvider: AllSettingsProvider,
  val supportUrl: String,
  fontLoaderBundle: Either[RefPath, StyleContent]
)(implicit val ec: ExecutionContext) extends AbstractController(components) with GeoRedirect with Circe with CanonicalLinks with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets


  def displayForm(): Action[AnyContent] = authenticatedAction(subscriptionsClientId).async { implicit request =>
      implicit val settings: AllSettings = settingsProvider.getAllSettings()
      identityService.getUser(request.user).fold(
        error => {
          SafeLogger.error(scrub"Failed to display Guardian Weekly subscriptions form for ${request.user.id} due to error from identityService: $error")
          Future.successful(InternalServerError)
        },
        user => {
          Future.successful(Ok(paperSubscriptionFormHtml(user)))
        }
      ).flatten.map(_.withSettingsSurrogateKey)
    }

  private def paperSubscriptionFormHtml(idUser: IdUser)(implicit request: RequestHeader, settings: AllSettings): Html = {
    val title = "Support the Guardian | Guardian Weekly Subscription"
    val id = EmptyDiv("weekly-subscription-checkout-page")
    val js = "weeklySubscriptionCheckoutPage.js"
    val css = "weeklySubscriptionCheckoutPage.css"
    val csrf = CSRF.getToken.value
    val uatMode = testUsers.isTestUser(idUser.publicFields.displayName)
    val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil) ++
      List(GuardianWeekly.AnnualPromoCode, GuardianWeekly.SixForSixPromoCode)

    subscriptionCheckout(
      title,
      id,
      js,
      css,
      fontLoaderBundle,
      Some(csrf),
      idUser,
      uatMode,
      priceSummaryServiceProvider.forUser(uatMode).getPrices(GuardianWeekly, promoCodes),
      stripeConfigProvider.get(false),
      stripeConfigProvider.get(true),
      payPalConfigProvider.get(false),
      payPalConfigProvider.get(true)
    )
  }


}
