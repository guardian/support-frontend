package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import com.gu.i18n.CountryGroup._
import config.StringsConfig
import play.api.mvc._
import services.{IdentityService, PaymentAPIService}
import utils.BrowserCheck
import utils.RequestCountry._

import scala.concurrent.ExecutionContext

class Application(
    actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    identityService: IdentityService,
    components: ControllerComponents,
    paymentAPIService: PaymentAPIService,
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
      case Some(Europe) => "/eu/contribute"
      case Some(Canada) => "/ca/contribute"
      case Some(NewZealand) => "/nz/contribute"
      case Some(RestOfTheWorld) => "/int/contribute"
      case _ => "https://membership.theguardian.com/supporter"
    }

    Redirect(redirectUrl, request.queryString, status = FOUND)
  }

  def contributeGeoRedirect: Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>

    val redirectUrl = request.fastlyCountry match {
      case Some(UK) => "/uk/contribute"
      case Some(US) => "/us/contribute"
      case Some(Europe) => "/eu/contribute"
      case Some(Canada) => "/ca/contribute"
      case Some(NewZealand) => "/nz/contribute"
      case Some(RestOfTheWorld) => "/int/contribute"
      case _ => "https://contribute.theguardian.com"
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
    Ok(views.html.unsupportedBrowserPage())
  }

  def supportLanding(title: String, id: String, js: String): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.supportLanding(
      title,
      id,
      js,
      paymentApiPayPalEndpoint = paymentAPIService.getCreatePaymentURL,
      description = Some(stringsConfig.supportLandingDescription)
    ))
  }

  def contributionsLanding(title: String, id: String, js: String): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(
      views.html.contributionsLanding(
        title,
        description = Some(stringsConfig.contributionLandingDescription),
        id,
        js,
        paymentApiPayPalEndpoint = paymentAPIService.getCreatePaymentURL
      )
    )
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
