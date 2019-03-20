package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.data.EitherT
import cats.implicits._
import com.gu.i18n.CountryGroup._
import com.gu.identity.play.IdUser
import com.gu.support.config.{PayPalConfigProvider, Stage, Stages, StripeConfigProvider}
import com.typesafe.scalalogging.StrictLogging
import config.Configuration.GuardianDomain
import config.StringsConfig
import cookies.ServersideAbTestCookie
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import play.api.mvc._
import services.{IdentityService, PaymentAPIService}
import utils.BrowserCheck
import utils.RequestCountry._
import views.{EmptyDiv, Preload}

import scala.concurrent.{ExecutionContext, Future}

class Application(
    actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    identityService: IdentityService,
    components: ControllerComponents,
    oneOffStripeConfigProvider: StripeConfigProvider,
    regularStripeConfigProvider: StripeConfigProvider,
    payPalConfigProvider: PayPalConfigProvider,
    paymentAPIService: PaymentAPIService,
    stringsConfig: StringsConfig,
    settingsProvider: AllSettingsProvider,
    guardianDomain: GuardianDomain,
    stage: Stage,
    val supportUrl: String,
    fontLoaderBundle: Either[RefPath, StyleContent]
)(implicit val ec: ExecutionContext) extends AbstractController(components)
  with SettingsSurrogateKeySyntax with CanonicalLinks with StrictLogging with ServersideAbTestCookie {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def contributionsRedirect(): Action[AnyContent] = CachedAction() {
    Ok(views.html.contributionsRedirect())
  }

  def geoRedirect: Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val redirectUrl = request.fastlyCountry match {
      case Some(UK) => buildCanonicalShowcaseLink("uk")
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

  def permanentRedirect(location: String): Action[AnyContent] = CachedAction() { implicit request =>
    Redirect(location, request.queryString, status = MOVED_PERMANENTLY)
  }

  // Country code is required here because it's a parameter in the route.
  def permanentRedirectWithCountry(country: String, location: String): Action[AnyContent] = CachedAction() { implicit request =>
    Redirect(location, request.queryString, status = MOVED_PERMANENTLY)
  }

  def redirectPath(location: String, path: String): Action[AnyContent] = CachedAction() { implicit request =>
    Redirect(location + path, request.queryString)
  }

  def unsupportedBrowser: Action[AnyContent] = NoCacheAction() { implicit request =>
    BrowserCheck.logUserAgent(request)
    SafeLogger.info("Redirecting to unsupported-browser page")
    Ok(views.html.unsupportedBrowserPage())
  }

  def contributionsLanding(
    countryCode: String
  ): Action[AnyContent] = maybeAuthenticatedAction().async { implicit request =>
    type Attempt[A] = EitherT[Future, String, A]
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    request.user.traverse[Attempt, IdUser](identityService.getUser(_)).fold(
      _ => Ok(contributionsHtml(countryCode, None)),
      user => Ok(contributionsHtml(countryCode, user))
    ).map(_.withSettingsSurrogateKey)
  }

  private def contributionsHtml(countryCode: String, idUser: Option[IdUser])
    (implicit request: RequestHeader, settings: AllSettings) = {

    val elementForStage = CSSElementForStage(assets.getFileContentsAsHtml, stage)_
    val css = elementForStage(RefPath("contributionsLandingPage.css"))

    val js = elementForStage(RefPath("contributionsLandingPage.js"))

    views.html.newContributions(
      title = "Support the Guardian | Make a Contribution",
      id = s"new-contributions-landing-page-$countryCode",
      js = js,
      css = css,
      fontLoaderBundle = fontLoaderBundle,
      description = stringsConfig.contributionsLandingDescription,
      oneOffDefaultStripeConfig = oneOffStripeConfigProvider.get(false),
      oneOffUatStripeConfig = oneOffStripeConfigProvider.get(true),
      regularDefaultStripeConfig = regularStripeConfigProvider.get(false),
      regularUatStripeConfig = regularStripeConfigProvider.get(true),
      regularDefaultPayPalConfig = payPalConfigProvider.get(false),
      regularUatPayPalConfig = payPalConfigProvider.get(true),
      paymentApiStripeEndpoint = paymentAPIService.stripeExecutePaymentEndpoint,
      paymentApiPayPalEndpoint = paymentAPIService.payPalCreatePaymentEndpoint,
      idUser = idUser
    )
  }

  def showcase: Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    Ok(views.html.main(
      title = "Support the Guardian",
      mainElement = EmptyDiv("showcase-landing-page"),
      mainJsBundle = Left(RefPath("showcasePage.js")),
      mainStyleBundle = Left(RefPath("showcasePage.css")),
      description = stringsConfig.showcaseLandingDescription,
      canonicalLink = Some(buildCanonicalShowcaseLink("uk"))
    )()).withSettingsSurrogateKey
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

object CSSElementForStage {

  def apply(getFileContentsAsHtml: RefPath => Option[StyleContent], stage: Stage)(cssPath: RefPath): Either[RefPath, StyleContent] = {
    if (stage == Stages.DEV) {
      Left(cssPath)
    } else {
      getFileContentsAsHtml(cssPath).fold[Either[RefPath, StyleContent]] {
        SafeLogger.error(scrub"Inline CSS failed to load for $cssPath") // in future add email perf alert instead (cloudwatch alarm perhaps)
        Left(cssPath)
      } { inlineCss =>
        Right(inlineCss)
      }
    }
  }

}
