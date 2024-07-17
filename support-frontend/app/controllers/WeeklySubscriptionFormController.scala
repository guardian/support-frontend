package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.AssetsResolver
import com.gu.identity.model.{User => IdUser}
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.config.{PayPalConfigProvider, Stage, StripePublicConfigProvider}
import services.pricing.PriceSummaryServiceProvider
import com.gu.support.promotions.DefaultPromotions
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import config.RecaptchaConfigProvider
import play.api.mvc._
import play.twirl.api.Html
import services.{CachedProductCatalogServiceProvider, TestUserService}
import views.EmptyDiv
import views.html.helper.CSRF
import views.html.subscriptionCheckout

import scala.concurrent.ExecutionContext

class WeeklySubscriptionFormController(
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    val assets: AssetsResolver,
    val actionRefiners: CustomActionBuilders,
    testUsers: TestUserService,
    stripeConfigProvider: StripePublicConfigProvider,
    payPalConfigProvider: PayPalConfigProvider,
    components: ControllerComponents,
    settingsProvider: AllSettingsProvider,
    recaptchaConfigProvider: RecaptchaConfigProvider,
    cachedProductCatalogServiceProvider: CachedProductCatalogServiceProvider,
    stage: Stage,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def displayForm(orderIsAGift: Boolean): Action[AnyContent] = MaybeAuthenticatedAction { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    Ok(weeklySubscriptionFormHtml(request.user, orderIsAGift)).withSettingsSurrogateKey
  }

  private def weeklySubscriptionFormHtml(maybeIdUser: Option[IdUser], orderIsAGift: Boolean)(implicit
      request: RequestHeader,
      settings: AllSettings,
  ): Html = {
    val title = "Support the Guardian | Guardian Weekly Subscription"
    val id = EmptyDiv("weekly-subscription-checkout-page")
    val js = "weeklySubscriptionCheckoutPage.js"
    val css = "weeklySubscriptionCheckoutPage.css"
    val csrf = CSRF.getToken.value

    val testMode = testUsers.isTestUser(request)
    val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
    val readerType = if (orderIsAGift) Gift else Direct
    val v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(isTestUser = testMode).v2PublicKey

    val isTestUser = testUsers.isTestUser(request)
    val productCatalog = cachedProductCatalogServiceProvider.fromStage(stage, isTestUser).get()

    subscriptionCheckout(
      title,
      id,
      js,
      css,
      Some(csrf),
      maybeIdUser,
      testMode,
      priceSummaryServiceProvider.forUser(testMode).getPrices(GuardianWeekly, promoCodes, readerType),
      maybePromotionCopy = None,
      stripeConfigProvider.get(),
      stripeConfigProvider.get(true),
      payPalConfigProvider.get(),
      payPalConfigProvider.get(true),
      v2recaptchaConfigPublicKey,
      orderIsAGift,
      None,
      productCatalog,
    )
  }

}
