package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.implicits._
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.pricing.PriceSummaryServiceProvider
import com.gu.support.promotions.DefaultPromotions
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import config.RecaptchaConfigProvider
import play.api.mvc._
import play.twirl.api.Html
import services.{IdentityService, TestUserService}
import views.EmptyDiv
import views.html.helper.CSRF
import views.html.subscriptionCheckout

import scala.concurrent.{ExecutionContext, Future}

class WeeklySubscriptionForm(
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

  def displayForm(orderIsAGift: Boolean): Action[AnyContent] = authenticatedAction(subscriptionsClientId).async { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    identityService.getUser(request.user.minimalUser).fold(
      error => {
        SafeLogger.error(
          scrub"Failed to display Guardian Weekly subscriptions form for ${request.user.minimalUser.id} due to error from identityService: $error"
        )
        Future.successful(InternalServerError)
      },
      user => {
        Future.successful(Ok(paperSubscriptionFormHtml(user, orderIsAGift)))
      }
    ).flatten.map(_.withSettingsSurrogateKey)
  }

  private def paperSubscriptionFormHtml(idUser: IdUser, orderIsAGift: Boolean)(implicit request: RequestHeader, settings: AllSettings): Html = {
    val title = "Support the Guardian | Guardian Weekly Subscription"
    val id = EmptyDiv("weekly-subscription-checkout-page")
    val js = "weeklySubscriptionCheckoutPage.js"
    val css = "weeklySubscriptionCheckoutPage.css"
    val csrf = CSRF.getToken.value
    val uatMode = testUsers.isTestUser(idUser.publicFields.displayName)
    val defaultPromos = if (orderIsAGift)
      DefaultPromotions.GuardianWeekly.Gift.all
    else
      DefaultPromotions.GuardianWeekly.NonGift.all
    val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil) ++ defaultPromos
    val readerType = if (orderIsAGift) Gift else Direct
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
      priceSummaryServiceProvider.forUser(uatMode).getPrices(GuardianWeekly, promoCodes, readerType),
      stripeConfigProvider.get(),
      stripeConfigProvider.get(true),
      payPalConfigProvider.get(),
      payPalConfigProvider.get(true),
      v2recaptchaConfigPublicKey,
      orderIsAGift
    )
  }


}
