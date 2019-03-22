package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import config.StringsConfig
import play.api.mvc._
import services.IdentityService
import views.EmptyDiv

import scala.concurrent.ExecutionContext

class Subscriptions(
    val actionRefiners: CustomActionBuilders,
    identityService: IdentityService,
    val assets: AssetsResolver,
    components: ControllerComponents,
    stringsConfig: StringsConfig,
    settingsProvider: AllSettingsProvider,
    val supportUrl: String,
    fontLoaderBundle: Either[RefPath, StyleContent]
)(implicit val ec: ExecutionContext) extends AbstractController(components) with GeoRedirect with CanonicalLinks with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def geoRedirect: Action[AnyContent] = geoRedirect("subscribe")

  def legacyRedirect(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    // Country code is required here because it's a parameter in the route.
    // But we don't actually use it.
    Redirect("https://subscribe.theguardian.com", request.queryString, status = FOUND)
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
    val hrefLangLinks = Map(
      "en-us" -> buildCanonicalWeeklySubscriptionLink("us"),
      "en-gb" -> buildCanonicalWeeklySubscriptionLink("uk"),
      "en-au" -> buildCanonicalWeeklySubscriptionLink("au"),
      "en-nz" -> buildCanonicalWeeklySubscriptionLink("nz"),
      "en-ca" -> buildCanonicalWeeklySubscriptionLink("ca"),
      "en" -> buildCanonicalWeeklySubscriptionLink("int"),
      "en" -> buildCanonicalWeeklySubscriptionLink("eu")
    )
    Ok(views.html.main(title, mainElement, js, css, fontLoaderBundle, description, canonicalLink, hrefLangLinks)()).withSettingsSurrogateKey
  }

}
