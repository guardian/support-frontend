package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, On, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.support.catalog.DigitalPack
import com.gu.support.config.Stages.PROD
import com.gu.support.config.{PayPalConfigProvider, Stage, StripePublicConfigProvider}
import com.gu.support.encoding.CustomCodecs._
import services.pricing.{PriceSummaryServiceProvider, ProductPrices}
import com.gu.support.promotions._
import com.gu.support.zuora.api.ReaderType.Direct
import config.RecaptchaConfigProvider
import services._
import play.api.mvc._
import play.twirl.api.Html
import views.EmptyDiv
import views.ViewHelpers._
import views.html.helper.CSRF

import scala.concurrent.ExecutionContext

class DigitalSubscriptionController(
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    landingCopyProvider: LandingCopyProvider,
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
    testUserService: TestUserService,
    val supportUrl: String,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with GeoRedirect
    with RegionalisedLinks
    with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def digitalGeoRedirect(): Action[AnyContent] = geoRedirect(
    "subscribe/digital",
  )

  def digitalEditionGeoRedirect(): Action[AnyContent] = geoRedirect("subscribe/digitaledition")

  def digital(countryCode: String): Action[AnyContent] = {
    MaybeAuthenticatedAction { implicit request =>
      implicit val settings: AllSettings = settingsProvider.getAllSettings()

      val title = "Support the Guardian | The Guardian Digital Subscription"

      val js = "digitalSubscriptionLandingPage.js"
      val css = "digitalSubscriptionLandingPage.css"
      val csrf = CSRF.getToken.value
      val testMode = testUsers.isTestUser(request)
      val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
      val v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(testMode).v2PublicKey
      val readerType = Direct
      val defaultPromos = priceSummaryServiceProvider.forUser(isTestUser = false).getDefaultPromoCodes(DigitalPack)
      val maybePromotionCopy = {
        landingCopyProvider.promotionCopy(promoCodes ++ defaultPromos, DigitalPack, "uk")
      }
      val mainElement = assets.getSsrCacheContentsAsHtml(
        divId = s"digital-subscription-landing-$countryCode",
        file = "ssr-holding-content.html",
      )

      val isTestUser = testUserService.isTestUser(request)
      val productCatalog = cachedProductCatalogServiceProvider.fromStage(stage, isTestUser).get()

      Ok(
        views.html.subscriptionCheckout(
          title = title,
          mainElement = mainElement,
          js = js,
          css = css,
          csrf = Some(csrf),
          idUser = request.user,
          testMode = testMode,
          productPrices = priceSummaryServiceProvider.forUser(testMode).getPrices(DigitalPack, promoCodes, readerType),
          maybePromotionCopy = maybePromotionCopy,
          defaultStripeConfig = stripeConfigProvider.get(),
          testStripeConfig = stripeConfigProvider.get(true),
          defaultPayPalConfig = payPalConfigProvider.get(),
          testPayPalConfig = payPalConfigProvider.get(true),
          v2recaptchaConfigPublicKey = v2recaptchaConfigPublicKey,
          homeDeliveryPostcodes = None,
          productCatalog = productCatalog,
          noIndex = stage != PROD,
        ),
      )
    }
  }

}
