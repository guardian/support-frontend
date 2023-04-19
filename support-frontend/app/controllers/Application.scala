package controllers

import actions.CustomActionBuilders
import admin.ServersideAbTest.generateParticipations
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.data.EitherT
import com.gu.i18n.CountryGroup
import com.gu.i18n.CountryGroup._
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.config._
import com.typesafe.scalalogging.StrictLogging
import config.{RecaptchaConfigProvider, StringsConfig}
import lib.RedirectWithEncodedQueryString
import models.GeoData
import play.api.mvc._
import services.{PaymentAPIService, TestUserService}
import utils.FastlyGEOIP._

import scala.concurrent.{ExecutionContext, Future}
import play.twirl.api.Html

case class ContributionsPaymentMethodConfigs(
    oneOffDefaultStripeConfig: StripeConfig,
    oneOffUatStripeConfig: StripeConfig,
    regularDefaultStripeConfig: StripeConfig,
    regularUatStripeConfig: StripeConfig,
    regularDefaultPayPalConfig: PayPalConfig,
    regularUatPayPalConfig: PayPalConfig,
    defaultAmazonPayConfig: AmazonPayConfig,
    uatAmazonPayConfig: AmazonPayConfig,
)

class Application(
    actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    testUsers: TestUserService,
    components: ControllerComponents,
    oneOffStripeConfigProvider: StripeConfigProvider,
    regularStripeConfigProvider: StripeConfigProvider,
    payPalConfigProvider: PayPalConfigProvider,
    amazonPayConfigProvider: AmazonPayConfigProvider,
    recaptchaConfigProvider: RecaptchaConfigProvider,
    paymentAPIService: PaymentAPIService,
    membersDataApiUrl: String,
    stringsConfig: StringsConfig,
    settingsProvider: AllSettingsProvider,
    stage: Stage,
    val supportUrl: String,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with SettingsSurrogateKeySyntax
    with CanonicalLinks
    with StrictLogging {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def contributionsRedirect(): Action[AnyContent] = CachedAction() {
    Ok(views.html.contributionsRedirect())
  }

  def geoRedirect: Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val redirectUrl = buildCanonicalContributeLink(request.geoData.countryGroup match {
      case Some(UK) => "uk"
      case Some(US) => "us"
      case Some(Australia) => "au"
      case Some(Europe) => "eu"
      case Some(Canada) => "ca"
      case Some(NewZealand) => "nz"
      case Some(RestOfTheWorld) => "int"
      case _ => "uk"
    })

    RedirectWithEncodedQueryString(redirectUrl, request.queryString, status = FOUND)
  }

  def supportGeoRedirect: Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val supportPageVariant = request.geoData.countryGroup match {
      case Some(US) => "us"
      case Some(Australia) => "au"
      case _ => "uk"
    }

    RedirectWithEncodedQueryString(
      buildCanonicalContributeLink(supportPageVariant),
      request.queryString,
      status = FOUND,
    )
  }

  def contributeGeoRedirect(campaignCode: String): Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val url = List(getGeoRedirectUrl(request.geoData.countryGroup, "contribute"), campaignCode)
      .filter(_.nonEmpty)
      .mkString("/")

    RedirectWithEncodedQueryString(url, request.queryString, status = FOUND)
  }

  def redirect(location: String): Action[AnyContent] = CachedAction() { implicit request =>
    RedirectWithEncodedQueryString(location, request.queryString, status = FOUND)
  }

  def permanentRedirect(location: String): Action[AnyContent] = CachedAction() { implicit request =>
    RedirectWithEncodedQueryString(location, request.queryString, status = MOVED_PERMANENTLY)
  }

  // Country code is required here because it's a parameter in the route.
  def permanentRedirectWithCountry(country: String, location: String): Action[AnyContent] = CachedAction() {
    implicit request =>
      RedirectWithEncodedQueryString(location, request.queryString, status = MOVED_PERMANENTLY)
  }

  def redirectPath(location: String, path: String): Action[AnyContent] = CachedAction() { implicit request =>
    RedirectWithEncodedQueryString(location + path, request.queryString)
  }

  def unsupportedBrowser: Action[AnyContent] = NoCacheAction() { implicit request =>
    Ok(views.html.unsupportedBrowserPage())
  }

  def contributionsLanding(
      countryCode: String,
      campaignCode: String,
  ): Action[AnyContent] = MaybeAuthenticatedAction { implicit request =>
    type Attempt[A] = EitherT[Future, String, A]

    val geoData = request.geoData

    val campaignCodeOption = if (campaignCode != "") Some(campaignCode) else None

    // This will be present if the token has been flashed into the session by the PayPal redirect endpoint
    val guestAccountCreationToken = request.flash.get("guestAccountCreationToken")

    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    Ok(
      contributionsHtml(countryCode, geoData, request.user, campaignCodeOption, guestAccountCreationToken),
    ).withSettingsSurrogateKey
  }

  def downForMaintenance(): Action[AnyContent] = NoCacheAction() { implicit request =>
    Ok(
      views.html.main(
        "Support the Guardian | Down for essential maintenance",
        views.EmptyDiv("down-for-maintenance-page"),
        Left(RefPath("downForMaintenancePage.js")),
        Left(RefPath("downForMaintenancePage.css")),
      )()(assets, request, settingsProvider.getAllSettings()),
    ).withSettingsSurrogateKey
  }

  private def shareImageUrl(settings: AllSettings): String = {
    // Autumn 2021 generic image
    "https://i.guim.co.uk/img/media/5366cacfd2081e5a4af259318238b3f82610d32e/0_0_1000_525/1000.png?quality=85&s=966978166c0983aef68828559ede40d8"
  }

  private def contributionsHtml(
      countryCode: String,
      geoData: GeoData,
      idUser: Option[IdUser],
      campaignCode: Option[String],
      guestAccountCreationToken: Option[String],
  )(implicit request: RequestHeader, settings: AllSettings) = {

    val elementForStage = CSSElementForStage(assets.getFileContentsAsHtml, stage) _
    val css = elementForStage(RefPath("supporterPlusLandingPage.css"))

    val js = elementForStage(RefPath("supporterPlusLandingPage.js"))

    val classes = "gu-content--contribution-form--placeholder" +
      campaignCode.map(code => s" gu-content--campaign-landing gu-content--$code").getOrElse("")

    val mainElement = assets.getSsrCacheContentsAsHtml(
      divId = s"supporter-plus-landing-page-$countryCode",
      file = "supporter-plus-landing.html",
      classes = Some(classes),
    )

    val serversideTests = generateParticipations(Nil)
    val uatMode = testUsers.isTestUser(request)

    views.html.contributions(
      title = "Support the Guardian",
      id = s"contributions-landing-page-$countryCode",
      mainElement = mainElement,
      js = js,
      css = css,
      description = stringsConfig.contributionsLandingDescription,
      paymentMethodConfigs = ContributionsPaymentMethodConfigs(
        oneOffDefaultStripeConfig = oneOffStripeConfigProvider.get(false),
        oneOffUatStripeConfig = oneOffStripeConfigProvider.get(true),
        regularDefaultStripeConfig = regularStripeConfigProvider.get(false),
        regularUatStripeConfig = regularStripeConfigProvider.get(true),
        regularDefaultPayPalConfig = payPalConfigProvider.get(false),
        regularUatPayPalConfig = payPalConfigProvider.get(true),
        defaultAmazonPayConfig = amazonPayConfigProvider.get(false),
        uatAmazonPayConfig = amazonPayConfigProvider.get(true),
      ),
      paymentApiUrl = paymentAPIService.paymentAPIUrl,
      paymentApiPayPalEndpoint = paymentAPIService.payPalCreatePaymentEndpoint,
      membersDataApiUrl = membersDataApiUrl,
      idUser = idUser,
      guestAccountCreationToken = guestAccountCreationToken,
      geoData = geoData,
      shareImageUrl = shareImageUrl(settings),
      shareUrl = "https://support.theguardian.com/contribute",
      v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(uatMode).v2PublicKey,
      serversideTests = serversideTests,
    )
  }

  val ausMomentMapSocialImageUrl =
    "https://i.guim.co.uk/img/media/3c2c30cccd48c91f55217bd0d961dbd20cf07274/0_0_1000_525/1000.png?quality=85&s=b1394cf888724cd40646850b807659f0"

  def ausMomentMap(): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    Ok(
      views.html.main(
        title = "Guardian Supporters Map",
        mainElement = assets.getSsrCacheContentsAsHtml("aus-moment-map", "aus-moment-map.html"),
        mainJsBundle = Left(RefPath("ausMomentMap.js")),
        mainStyleBundle = Left(RefPath("ausMomentMap.css")),
        description = stringsConfig.contributionsLandingDescription,
        canonicalLink = Some("https://support.theguardian.com/aus-map"),
        shareImageUrl = Some(
          ausMomentMapSocialImageUrl,
        ),
      )(),
    ).withSettingsSurrogateKey
  }

  def healthcheck: Action[AnyContent] = PrivateAction {
    Ok("healthy")
  }

  // Remove trailing slashes so that /uk/ redirects to /uk
  def removeTrailingSlash(path: String): Action[AnyContent] = CachedAction() { request =>
    RedirectWithEncodedQueryString("/" + path, request.queryString, MOVED_PERMANENTLY)
  }

  private def getGeoRedirectUrl(fastlyCountry: Option[CountryGroup], path: String): String = {
    fastlyCountry match {
      case Some(UK) => s"/uk/$path"
      case Some(US) => s"/us/$path"
      case Some(Australia) => s"/au/$path"
      case Some(Europe) => s"/eu/$path"
      case Some(Canada) => s"/ca/$path"
      case Some(NewZealand) => s"/nz/$path"
      case Some(RestOfTheWorld) => s"/int/$path"
      case _ => s"/uk/$path"
    }
  }
}

object CSSElementForStage {

  def apply(getFileContentsAsHtml: RefPath => Option[StyleContent], stage: Stage)(
      cssPath: RefPath,
  ): Either[RefPath, StyleContent] = {
    if (stage == Stages.DEV) {
      Left(cssPath)
    } else {
      getFileContentsAsHtml(cssPath).fold[Either[RefPath, StyleContent]] {
        SafeLogger.error(
          scrub"Inline CSS failed to load for $cssPath",
        ) // in future add email perf alert instead (cloudwatch alarm perhaps)
        Left(cssPath)
      } { inlineCss =>
        Right(inlineCss)
      }
    }
  }

}
