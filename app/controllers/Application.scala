package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import com.gu.i18n.CountryGroup._
import play.api.mvc._
import services.IdentityService
import utils.RequestCountry._
import config.StringsConfig
import utils.BrowserCheck

import scala.concurrent.ExecutionContext

class Application(
    actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    identityService: IdentityService,
    components: ControllerComponents,
    contributionsPayPalEndpoint: String,
    stringsConfig: StringsConfig
)(implicit val ec: ExecutionContext) extends AbstractController(components) {

  import actionRefiners._

  implicit val ar = assets
  def contributionsRedirect(): Action[AnyContent] = CachedAction() {
    Ok(views.html.contributionsRedirect())
  }

  def geoRedirect: Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>

    val redirectUrl = request.fastlyCountry match {
      case Some(UK) => "/uk"
      case Some(US) => "/us"
      case _ => "https://membership.theguardian.com/supporter"
    }

    Redirect(redirectUrl, request.queryString, status = FOUND)
  }

  def redirect(location: String): Action[AnyContent] = CachedAction() { implicit request =>
    Redirect(location, request.queryString, status = FOUND)
  }

  def redirectPath(location: String, path: String): Action[AnyContent] = CachedAction() { implicit request =>
    Redirect(location + path, request.queryString)
  }

  def unsupportedBrowser: Action[AnyContent] = CachedAction() { implicit request =>
    BrowserCheck.logUserAgent
    Ok(views.html.unsupportedBrowserPage())
  }

  def bundleLanding(title: String, id: String, js: String, newDesigns: String): Action[AnyContent] = CachedAction() { implicit request =>
    if (newDesigns == "circles") {
      Ok(views.html.bundleLanding(
        title,
        "support-landing-page-old",
        "supportLandingPageOld.js",
        contributionsPayPalEndpoint,
        description = Some(stringsConfig.bundleLandingDescription)
      ))
    } else if (newDesigns == "circles-garnett") {
      Ok(views.html.bundleLanding(
        title,
        "support-landing-page",
        "supportLandingPage.js",
        contributionsPayPalEndpoint,
        description = Some(stringsConfig.bundleLandingDescription)
      ))
    } else {
      Ok(views.html.bundleLanding(title, id, js, contributionsPayPalEndpoint, description = Some(stringsConfig.bundleLandingDescription)))
    }
  }

  def contributionsLanding(title: String, id: String, js: String): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.contributionsLanding(title, description = Some(stringsConfig.contributionLandingDescription), id, js, contributionsPayPalEndpoint))
  }

  def reactTemplate(title: String, id: String, js: String): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.react(title, id, js))
  }

  def authenticatedReactTemplate(title: String, id: String, js: String): Action[AnyContent] = AuthenticatedAction { implicit request =>
    Ok(views.html.react(title, id, js))
  }

  def healthcheck: Action[AnyContent] = PrivateAction {
    Ok("healthy")
  }

}
