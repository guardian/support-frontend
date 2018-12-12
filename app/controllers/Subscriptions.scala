package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import com.gu.i18n.CountryGroup._
import com.typesafe.scalalogging.LazyLogging
import config.StringsConfig
import play.api.mvc._
import admin.{Settings, SettingsProvider, SettingsSurrogateKeySyntax}
import com.gu.identity.play.IdUser
import play.twirl.api.Html
import services.IdentityService
import utils.RequestCountry._
import views.html.helper.CSRF
import cats.implicits._
import monitoring.SafeLogger
import monitoring.SafeLogger._

import scala.concurrent.{ExecutionContext, Future}
import views.html.digitalSubscription

class Subscriptions(
    actionRefiners: CustomActionBuilders,
    identityService: IdentityService,
    val assets: AssetsResolver,
    components: ControllerComponents,
    stringsConfig: StringsConfig,
    settingsProvider: SettingsProvider,
    supportUrl: String
)(implicit val ec: ExecutionContext) extends AbstractController(components) with LazyLogging with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def geoRedirect: Action[AnyContent] = geoRedirect("subscribe")

  def geoRedirect(path: String): Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    // If we implement endpoints for EU, CA & NZ we could replace this match with
    // request.fastlyCountry.map(_.id).getOrDefault("int")
    val redirectUrl = request.fastlyCountry match {
      case Some(UK) => s"/uk/$path"
      case Some(US) => s"/us/$path"
      case Some(Australia) => s"/au/$path"
      case _ => s"/int/$path"
    }
    Redirect(redirectUrl, request.queryString, status = FOUND)
  }

  def geoRedirectAllMarkets(path: String): Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val redirectUrl = request.fastlyCountry match {
      case Some(UK) => s"/uk/$path"
      case Some(US) => s"/us/$path"
      case Some(Australia) => s"/au/$path"
      case Some(Europe) => s"/eu/$path"
      case Some(Canada) => s"/ca/$path"
      case Some(NewZealand) => s"/nz/$path"
      case _ => s"/int/$path"
    }
    Redirect(redirectUrl, request.queryString, status = FOUND)
  }

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

  def digital(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: Settings = settingsProvider.settings()
    val title = "Support the Guardian | Digital Pack Subscription"
    val id = "digital-subscription-landing-page-" + countryCode
    val js = "digitalSubscriptionLandingPage.js"
    val css = "digitalSubscriptionLandingPageStyles.css"
    val description = stringsConfig.digitalPackLandingDescription
    val canonicalLink = Some(buildCanonicalDigitalSubscriptionLink("uk"))
    val hrefLangLinks = Map(
      "en-us" -> buildCanonicalDigitalSubscriptionLink("us"),
      "en-gb" -> buildCanonicalDigitalSubscriptionLink("uk"),
      "en-au" -> buildCanonicalDigitalSubscriptionLink("au"),
      "en" -> buildCanonicalDigitalSubscriptionLink("int")
    )

    Ok(views.html.main(title, id, js, css, description, canonicalLink, hrefLangLinks)).withSettingsSurrogateKey
  }

  def digitalGeoRedirect: Action[AnyContent] = geoRedirect("subscribe/digital")

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

  private def digitalSubscriptionFormHtml(idUser: IdUser, countryCode: String)(implicit request: RequestHeader, settings: Settings): Html = {
    val title = "Support the Guardian | Digital Subscription"
    val id = "digital-subscription-checkout-page-" + countryCode
    val js = "digitalSubscriptionCheckoutPage.js"
    val css = "digitalSubscriptionCheckoutPageStyles.css"
    val csrf = CSRF.getToken.value

    digitalSubscription(title, id, js, css, Some(csrf), idUser)
  }

  def displayForm(countryCode: String, displayCheckout: Boolean, isCsrf: Boolean = false): Action[AnyContent] = {
    authenticatedAction(recurringIdentityClientId).async { implicit request =>
      implicit val settings: Settings = settingsProvider.settings()
      if (displayCheckout) {
        identityService.getUser(request.user).fold(
          error => {
            SafeLogger.error(scrub"Failed to display digital subscriptions form for ${request.user.id} due to error from identityService: $error")
            InternalServerError
          },
          user => Ok(digitalSubscriptionFormHtml(user, countryCode))
        ).map(_.withSettingsSurrogateKey)
      } else {
        Future.successful(Redirect(routes.Subscriptions.geoRedirect))
      }
    }
  }

  def buildCanonicalPaperSubscriptionLink(withDelivery: Boolean = false): String =
    if (withDelivery) s"${supportUrl}/uk/subscribe/paper/delivery"
    else s"${supportUrl}/uk/subscribe/paper"

  def buildCanonicalDigitalSubscriptionLink(countryCode: String): String =
    s"${supportUrl}/${countryCode}/subscribe/digital"

  def buildCanonicalWeeklySubscriptionLink(countryCode: String): String =
    s"${supportUrl}/${countryCode}/subscribe/weekly"

}
