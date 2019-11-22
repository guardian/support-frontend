package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.config.Stage
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.pricing.PriceSummaryServiceProvider
import com.gu.support.promotions.{ProductPromotionCopy, PromotionServiceProvider}
import config.StringsConfig
import lib.RedirectWithEncodedQueryString
import play.api.mvc._
import play.twirl.api.Html
import services.IdentityService
import views.EmptyDiv
import views.ViewHelpers.outputJson

import scala.concurrent.ExecutionContext

class Subscriptions(
    val actionRefiners: CustomActionBuilders,
    identityService: IdentityService,
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    promotionServiceProvider: PromotionServiceProvider,
    val assets: AssetsResolver,
    components: ControllerComponents,
    stringsConfig: StringsConfig,
    settingsProvider: AllSettingsProvider,
    val supportUrl: String,
    fontLoaderBundle: Either[RefPath, StyleContent],
    stage: Stage
)(implicit val ec: ExecutionContext) extends AbstractController(components) with GeoRedirect with CanonicalLinks with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def geoRedirect: Action[AnyContent] = geoRedirect("subscribe")

  def legacyRedirect(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    // Country code is required here because it's a parameter in the route.
    // But we don't actually use it.
    RedirectWithEncodedQueryString("https://subscribe.theguardian.com", request.queryString, status = FOUND)
  }

  def landing(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | Get a Subscription"
    val mainElement = EmptyDiv("subscriptions-landing-page")
    val js = "subscriptionsLandingPage.js"
    Ok(views.html.main(
      title,
      mainElement,
      Left(RefPath(js)),
      Left(RefPath("subscriptionsLandingPage.css")),
      fontLoaderBundle,
      description = stringsConfig.subscriptionsLandingDescription
    )()).withSettingsSurrogateKey

  }

  def weeklyGeoRedirect: Action[AnyContent] = geoRedirect("subscribe/weekly")

  def weekly(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "The Guardian Weekly Subscriptions | The Guardian"
    val mainElement = EmptyDiv("weekly-landing-page-" + countryCode)
    val js = Left(RefPath("weeklySubscriptionLandingPage.js"))
    val css = Left(RefPath("weeklySubscriptionLandingPage.css"))
    val description = stringsConfig.weeklyLandingDescription
    val canonicalLink = Some(buildCanonicalWeeklySubscriptionLink("uk"))
    val queryPromos = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
    val promoCodes =  queryPromos ++ List(GuardianWeekly.AnnualPromoCode, GuardianWeekly.SixForSixPromoCode)
    val productPrices = priceSummaryServiceProvider.forUser(false).getPrices(GuardianWeekly, promoCodes)
    val maybePromotionCopy = queryPromos.headOption.flatMap(promoCode =>
      ProductPromotionCopy(promotionServiceProvider.forUser(false), stage)
        .getCopyForPromoCode(promoCode, GuardianWeekly, CountryGroup.countryByCode(countryCode).getOrElse(Country.UK))
    )
    val hrefLangLinks = Map(
      "en-us" -> buildCanonicalWeeklySubscriptionLink("us"),
      "en-gb" -> buildCanonicalWeeklySubscriptionLink("uk"),
      "en-au" -> buildCanonicalWeeklySubscriptionLink("au"),
      "en-nz" -> buildCanonicalWeeklySubscriptionLink("nz"),
      "en-ca" -> buildCanonicalWeeklySubscriptionLink("ca"),
      "en" -> buildCanonicalWeeklySubscriptionLink("int"),
      "en" -> buildCanonicalWeeklySubscriptionLink("eu")
    )
    Ok(views.html.main(title, mainElement, js, css, fontLoaderBundle, description, canonicalLink, hrefLangLinks){
      Html(
        s"""<script type="text/javascript">
              window.guardian.productPrices = ${outputJson(productPrices)}
              window.guardian.promotionCopy = ${outputJson(maybePromotionCopy)}
            </script>""")
    }).withSettingsSurrogateKey
  }

}
