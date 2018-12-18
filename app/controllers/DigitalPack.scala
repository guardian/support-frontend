package controllers

import actions.CustomActionBuilders
import admin.{Settings, SettingsProvider, SettingsSurrogateKeySyntax}
import assets.AssetsResolver
import cats.implicits._
import com.gu.identity.play.IdUser
import config.StringsConfig
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.mvc.{Action, AnyContent, ControllerComponents, RequestHeader}
import play.twirl.api.Html
import services.IdentityService
import views.html.digitalSubscription
import views.html.helper.CSRF

import scala.concurrent.{ExecutionContext, Future}

class DigitalPack(
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

  def displayForm(countryCode: String, displayCheckout: Boolean, isCsrf: Boolean = false): Action[AnyContent] =
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

  private def digitalSubscriptionFormHtml(idUser: IdUser, countryCode: String)(implicit request: RequestHeader, settings: Settings): Html = {
    val title = "Support the Guardian | Digital Subscription"
    val id = "digital-subscription-checkout-page-" + countryCode
    val js = "digitalSubscriptionCheckoutPage.js"
    val css = "digitalSubscriptionCheckoutPageStyles.css"
    val csrf = CSRF.getToken.value

    digitalSubscription(title, id, js, css, Some(csrf), idUser)
  }

  def create(countryCode: String): Action[AnyContent] = authenticatedAction(recurringIdentityClientId).async {
    implicit request =>
      Future.successful(Ok("test"))
  }

}
