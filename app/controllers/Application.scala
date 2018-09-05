package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import cats.data.EitherT
import cats.implicits._
import com.gu.i18n.CountryGroup._
import com.gu.support.config.StripeConfigProvider
import com.gu.identity.play.IdUser
import config.StringsConfig
import play.api.mvc._
import services.{IdentityService, PaymentAPIService}
import switchboard.Switches
import utils.BrowserCheck
import utils.RequestCountry._
import scala.concurrent.{ExecutionContext, Future}
import monitoring.SafeLogger

class Application(
    actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    identityService: IdentityService,
    components: ControllerComponents,
    stripeConfigProvider: StripeConfigProvider,
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

  def newContributionsLanding(countryCode: String): Action[AnyContent] = maybeAuthenticatedAction().async { implicit request =>
    type Attempt[A] = EitherT[Future, String, A]
    request.user.traverse[Attempt, IdUser](identityService.getUser(_)).fold(
      _ => Ok(newContributions(countryCode, None)),
      user => Ok(newContributions(countryCode, user))
    )
  }

  private def newContributions(countryCode: String, idUser: Option[IdUser])(implicit request: RequestHeader) =
    views.html.oneOffContributions(
      title = "Support the Guardian | Make a Contribution",
      id = s"new-contributions-landing-page-$countryCode",
      js = "newContributionsLandingPage.js",
      css = "newContributionsLandingPageStyles.css",
      defaultStripeConfig = stripeConfigProvider.get(false),
      uatStripeConfig = stripeConfigProvider.get(true),
      paymentApiStripeEndpoint = paymentAPIService.stripeExecutePaymentEndpoint,
      paymentApiPayPalEndpoint = paymentAPIService.payPalCreatePaymentEndpoint,
      idUser = idUser
    )

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
