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
      case Some(US) => "/us/contribute"
      case Some(Australia) => "/au/contribute"
      case Some(Europe) => "/eu/contribute"
      case Some(Canada) => "/ca/contribute"
      case Some(NewZealand) => "/nz/contribute"
      case Some(RestOfTheWorld) => "/int/contribute"
      case _ => "/uk/contribute"
    }

    Redirect(redirectUrl, request.queryString, status = FOUND)
  }

  def contributeGeoRedirect: Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val redirectUrl = request.fastlyCountry match {
      case Some(UK) => "/uk/contribute"
      case Some(US) => "/us/contribute"
      case Some(Australia) => "/au/contribute"
      case Some(Europe) => "/eu/contribute"
      case Some(Canada) => "/ca/contribute"
      case Some(NewZealand) => "/nz/contribute"
      case Some(RestOfTheWorld) => "/int/contribute"
      case _ => "/uk/contribute"
    }

    Redirect(redirectUrl, request.queryString, status = FOUND)
  }

  def subscribeGeoRedirect: Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val redirectUrl = request.fastlyCountry match {
      case Some(UK) => "/uk/subscribe"
      case _ => "https://subscribe.theguardian.com"
    }

    Redirect(redirectUrl, request.queryString, status = FOUND)
  }

  def subscribeRedirect(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    // Country code is required here because it's a parameter in the route.
    // But we don't actually use it.
    Redirect("https://subscribe.theguardian.com", request.queryString, status = FOUND)
  }

  def redirect(location: String): Action[AnyContent] = CachedAction() { implicit request =>
    Redirect(location, request.queryString, status = FOUND)
  }

  def redirectPath(location: String, path: String): Action[AnyContent] = CachedAction() { implicit request =>
    Redirect(location + path, request.queryString)
  }

  def unsupportedBrowser: Action[AnyContent] = NoCacheAction() { implicit request =>
    BrowserCheck.logUserAgent(request)
    Ok(views.html.unsupportedBrowserPage())
  }

  def supportLanding(title: String, id: String, js: String): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.supportLanding(
      title,
      id,
      js,
      contributionsPayPalEndpoint,
      description = Some(stringsConfig.supportLandingDescription)
    ))
  }

  def contributionsLanding(id: String): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.contributionsLanding(
      title = "Support the Guardian | Make a Contribution",
      description = Some(stringsConfig.contributionsLandingDescription),
      id,
      js = "contributionsLandingPage.js",
      css = "contributionsLandingPageStyles.css",
      contributionsPayPalEndpoint)
    )
  }

  def subscriptionsLanding(title: String, id: String, js: String): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.react(title, id, js, Some(stringsConfig.subscriptionsLandingDescription)))
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
