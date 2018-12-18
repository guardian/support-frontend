package controllers

import actions.CustomActionBuilders
import admin.{Settings, SettingsProvider, SettingsSurrogateKeySyntax}
import assets.AssetsResolver
import config.StringsConfig
import play.api.mvc._
import services.IdentityService

import scala.concurrent.ExecutionContext

class Subscriptions(
    actionRefiners: CustomActionBuilders,
    identityService: IdentityService,
    val assets: AssetsResolver,
    components: ControllerComponents,
    stringsConfig: StringsConfig,
    settingsProvider: SettingsProvider,
    val supportUrl: String
)(implicit val ec: ExecutionContext) extends GeoRedirect(components, actionRefiners) with CanonicalLinks with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def geoRedirect: Action[AnyContent] = geoRedirect("subscribe")

  def legacyRedirect(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    // Country code is required here because it's a parameter in the route.
    // But we don't actually use it.
    Redirect("https://subscribe.theguardian.com", request.queryString, status = FOUND)
  }

  def landing(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: Settings = settingsProvider.settings()
    val title = "Support the Guardian | Get a Subscription"
    val id = "subscriptions-landing-page"
    val js = "subscriptionsLandingPage.js"
    Ok(views.html.main(
      title,
      id,
      js,
      "subscriptionsLandingPageStyles.css",
      description = stringsConfig.subscriptionsLandingDescription
    )).withSettingsSurrogateKey

  }

  def premiumTier(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: Settings = settingsProvider.settings()
    val title = "Support the Guardian | Premium Tier"
    val id = "premium-tier-landing-page-" + countryCode
    val js = "premiumTierLandingPage.js"
    val css = "premiumTierLandingPageStyles.css"
    Ok(views.html.main(title, id, js, css)).withSettingsSurrogateKey
  }

  def weeklyGeoRedirect: Action[AnyContent] = geoRedirectAllMarkets("subscribe/weekly")

  def weekly(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: Settings = settingsProvider.settings()
    val title = "The Guardian Weekly Subscriptions | The Guardian"
    val id = "weekly-landing-page-" + countryCode
    val js = "weeklySubscriptionLandingPage.js"
    val css = "weeklySubscriptionLandingPage.css"
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
    Ok(views.html.main(title, id, js, css, description, canonicalLink, hrefLangLinks)).withSettingsSurrogateKey
  }

  def paperMethodRedirect(withDelivery: Boolean = false): Action[AnyContent] = Action { implicit request =>
    Redirect(buildCanonicalPaperSubscriptionLink(withDelivery), request.queryString, status = FOUND)
  }

  def paper(withDelivery: Boolean = false): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: Settings = settingsProvider.settings()
    val title = "The Guardian Newspaper Subscription | Vouchers and Delivery"
    val id = if (withDelivery) "paper-subscription-landing-page-delivery" else "paper-subscription-landing-page-collection"
    val js = "paperSubscriptionLandingPage.js"
    val css = "paperSubscriptionLandingPage.css"
    val canonicalLink = Some(buildCanonicalPaperSubscriptionLink())
    val description = stringsConfig.paperLandingDescription

    Ok(views.html.main(title, id, js, css, description, canonicalLink)).withSettingsSurrogateKey
  }

  def premiumTierGeoRedirect: Action[AnyContent] = geoRedirect("subscribe/premium-tier")

}
