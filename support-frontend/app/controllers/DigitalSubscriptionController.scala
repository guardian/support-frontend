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
}
