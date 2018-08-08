package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import com.gu.i18n.CountryGroup._
import config.StringsConfig
import play.api.mvc._
import services.{IdentityService, PaymentAPIService}
import switchboard.Switches
import utils.BrowserCheck
import utils.RequestCountry._
import scala.concurrent.ExecutionContext
import monitoring.SafeLogger

class Application(
    actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    identityService: IdentityService,
    components: ControllerComponents,
    paymentAPIService: PaymentAPIService,
    stringsConfig: StringsConfig,
    switches: Switches
)(implicit val ec: ExecutionContext) extends AbstractController(components) {

  import actionRefiners._

  implicit val ar = assets
  implicit val sw = switches

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

  def redirect(location: String): Action[AnyContent] = CachedAction() { implicit request =>
    Redirect(location, request.queryString, status = FOUND)
  }

  def redirectPath(location: String, path: String): Action[AnyContent] = CachedAction() { implicit request =>
    Redirect(location + path, request.queryString)
  }

  def unsupportedBrowser: Action[AnyContent] = NoCacheAction() { implicit request =>
    BrowserCheck.logUserAgent(request)
    SafeLogger.info("Redirecting to unsupported-browser page")
    Ok(views.html.unsupportedBrowserPage())
  }

  def supportLanding(): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.main(
      title = "Support the Guardian",
      mainId = "support-landing-page",
      mainJsBundle = "supportLandingPage.js",
      mainStyleBundle = "supportLandingPageStyles.css",
      scripts = views.html.addToWindow("paymentApiPayPalEndpoint", paymentAPIService.payPalCreatePaymentEndpoint),
      description = Some(stringsConfig.supportLandingDescription)
    ))
  }

  def contributionsLanding(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.main(
      title = "Support the Guardian | Make a Contribution",
      description = Some(stringsConfig.contributionsLandingDescription),
      mainId = s"contributions-landing-page-$countryCode",
      mainJsBundle = "contributionsLandingPage.js",
      mainStyleBundle = "contributionsLandingPageStyles.css",
      scripts = views.html.addToWindow("paymentApiPayPalEndpoint", paymentAPIService.payPalCreatePaymentEndpoint)
    ))
  }

  def newContributionsLanding(): Action[AnyContent] = NoCacheAction() { implicit request =>
    Ok(views.html.newMain(
      title = "Support the Guardian | Make a Contribution",
      description = Some(stringsConfig.contributionsLandingDescription)
    ))
  }

  def reactTemplate(title: String, id: String, js: String, css: String): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.main(title, id, js, css))
  }

  def healthcheck: Action[AnyContent] = PrivateAction {
    Ok("healthy")
  }

  // Remove trailing slashes so that /uk/ redirects to /uk
  def removeTrailingSlash(path: String): Action[AnyContent] = CachedAction() {
    request =>
      Redirect("/" + path, request.queryString, MOVED_PERMANENTLY)
  }
}
