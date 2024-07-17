package controllers

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.{AsyncAuthenticatedBuilder, CacheControl, CustomActionBuilders}
import admin.ServersideAbTest.generateParticipations
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.data.EitherT
import com.gu.googleauth.AuthAction
import com.gu.i18n.CountryGroup
import com.gu.i18n.CountryGroup._
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogging
import com.gu.support.catalog.{Product, SupporterPlus, TierThree}
import com.gu.support.config._
import com.typesafe.scalalogging.StrictLogging
import config.{RecaptchaConfigProvider, StringsConfig}
import lib.RedirectWithEncodedQueryString
import models.GeoData
import play.api.libs.circe.Circe
import play.api.libs.ws.WSClient
import play.api.mvc._
import services.pricing.{PriceSummaryServiceProvider, ProductPrices}
import services.{CachedProductCatalogServiceProvider, PaymentAPIService, TestUserService}
import utils.FastlyGEOIP._
import views.EmptyDiv
import wiring.GoogleAuth

import scala.concurrent.{ExecutionContext, Future}

case class PaymentMethodConfigs(
    oneOffDefaultStripeConfig: StripePublicConfig,
    oneOffTestStripeConfig: StripePublicConfig,
    regularDefaultStripeConfig: StripePublicConfig,
    regularTestStripeConfig: StripePublicConfig,
    regularDefaultPayPalConfig: PayPalConfig,
    regularTestPayPalConfig: PayPalConfig,
    defaultAmazonPayConfig: AmazonPayConfig,
    testAmazonPayConfig: AmazonPayConfig,
)

// This class is only needed because you can't pass more than 22 arguments to a twirl template and passing both types of
// product prices to the contributions template would exceed that limit.
case class LandingPageProductPrices(supporterPlusProductPrices: ProductPrices, tierThreeProductPrices: ProductPrices)

class Application(
    actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    testUserService: TestUserService,
    components: ControllerComponents,
    oneOffStripeConfigProvider: StripePublicConfigProvider,
    regularStripeConfigProvider: StripePublicConfigProvider,
    payPalConfigProvider: PayPalConfigProvider,
    amazonPayConfigProvider: AmazonPayConfigProvider,
    recaptchaConfigProvider: RecaptchaConfigProvider,
    paymentAPIService: PaymentAPIService,
    membersDataApiUrl: String,
    stringsConfig: StringsConfig,
    settingsProvider: AllSettingsProvider,
    stage: Stage,
    authAction: AuthAction[AnyContent],
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    cachedProductCatalogServiceProvider: CachedProductCatalogServiceProvider,
    val supportUrl: String,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with SettingsSurrogateKeySyntax
    with CanonicalLinks
    with StrictLogging
    with Circe {

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
        RefPath("downForMaintenancePage.js"),
        Some(RefPath("downForMaintenancePage.css")),
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

    val classes = "gu-content--contribution-form--placeholder" +
      campaignCode.map(code => s" gu-content--campaign-landing gu-content--$code").getOrElse("")

    val mainElement = assets.getSsrCacheContentsAsHtml(
      divId = s"supporter-plus-landing-page-$countryCode",
      file = "supporter-plus-landing.html",
      classes = Some(classes),
    )

    val serversideTests = generateParticipations(Nil)
    val isTestUser = testUserService.isTestUser(request)

    val queryPromos =
      request.queryString
        .getOrElse("promoCode", Nil)
        .toList

    val supporterPlusProductPrices =
      priceSummaryServiceProvider.forUser(isTestUser).getPrices(SupporterPlus, queryPromos)
    val tierThreeProductPrices =
      priceSummaryServiceProvider.forUser(isTestUser).getPrices(TierThree, queryPromos)

    val productCatalog = cachedProductCatalogServiceProvider.fromStage(stage, isTestUser).get()

    views.html.contributions(
      title = "Support the Guardian",
      id = s"contributions-landing-page-$countryCode",
      mainElement = mainElement,
      js = RefPath("supporterPlusLandingPage.js"),
      css = Some(RefPath("supporterPlusLandingPage.css")),
      description = stringsConfig.contributionsLandingDescription,
      paymentMethodConfigs = PaymentMethodConfigs(
        oneOffDefaultStripeConfig = oneOffStripeConfigProvider.get(false),
        oneOffTestStripeConfig = oneOffStripeConfigProvider.get(true),
        regularDefaultStripeConfig = regularStripeConfigProvider.get(false),
        regularTestStripeConfig = regularStripeConfigProvider.get(true),
        regularDefaultPayPalConfig = payPalConfigProvider.get(false),
        regularTestPayPalConfig = payPalConfigProvider.get(true),
        defaultAmazonPayConfig = amazonPayConfigProvider.get(false),
        testAmazonPayConfig = amazonPayConfigProvider.get(true),
      ),
      paymentApiUrl = paymentAPIService.paymentAPIUrl,
      paymentApiPayPalEndpoint = paymentAPIService.payPalCreatePaymentEndpoint,
      membersDataApiUrl = membersDataApiUrl,
      idUser = idUser,
      guestAccountCreationToken = guestAccountCreationToken,
      geoData = geoData,
      shareImageUrl = shareImageUrl(settings),
      shareUrl = "https://support.theguardian.com/contribute",
      v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(isTestUser).v2PublicKey,
      serversideTests = serversideTests,
      landingPageProductPrices = LandingPageProductPrices(supporterPlusProductPrices, tierThreeProductPrices),
      productCatalog = productCatalog,
    )
  }

  val ausMomentMapSocialImageUrl =
    "https://i.guim.co.uk/img/media/3c2c30cccd48c91f55217bd0d961dbd20cf07274/0_0_1000_525/1000.png?quality=85&s=b1394cf888724cd40646850b807659f0"

  def ausMomentMap(): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    Ok(
      views.html.main(
        title = "Guardian Supporters Map",
        mainElement = EmptyDiv("aus-moment-map"),
        mainJsBundle = RefPath("ausMomentMap.js"),
        mainStyleBundle = Some(RefPath("ausMomentMap.css")),
        description = stringsConfig.contributionsLandingDescription,
        canonicalLink = Some("https://support.theguardian.com/aus-map"),
        shareImageUrl = Some(
          ausMomentMapSocialImageUrl,
        ),
      )(),
    ).withSettingsSurrogateKey
  }

  def healthcheck: Action[AnyContent] = PrivateAction {
    if (priceSummaryServiceProvider.forUser(false).getPrices(SupporterPlus, List()).isEmpty)
      InternalServerError("no prices in catalog")
    else
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

  def router(countryGroupId: String): Action[AnyContent] = MaybeAuthenticatedAction { implicit request =>
    request.queryString
      .getOrElse("product", Nil)
      .headOption
      .flatMap(productString => Product.fromString(productString))
      .map(routeForProduct(_))
      .getOrElse(BadRequest("No product name provided"))
  }

  def routeForProduct(product: Product)(implicit request: OptionalAuthRequest[AnyContent]) = {
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val geoData = request.geoData
    val serversideTests = generateParticipations(Nil)
    val isTestUser = testUserService.isTestUser(request)
    // This will be present if the token has been flashed into the session by the PayPal redirect endpoint
    val guestAccountCreationToken = request.flash.get("guestAccountCreationToken")
    val productCatalog = cachedProductCatalogServiceProvider.fromStage(stage, isTestUser).get()

    val queryPromos =
      request.queryString
        .getOrElse("promoCode", Nil)
        .toList
    val productPrices = priceSummaryServiceProvider.forUser(isTestUser).getPrices(product, queryPromos)

    Ok(
      views.html.router(
        geoData = geoData,
        paymentMethodConfigs = PaymentMethodConfigs(
          oneOffDefaultStripeConfig = oneOffStripeConfigProvider.get(false),
          oneOffTestStripeConfig = oneOffStripeConfigProvider.get(true),
          regularDefaultStripeConfig = regularStripeConfigProvider.get(false),
          regularTestStripeConfig = regularStripeConfigProvider.get(true),
          regularDefaultPayPalConfig = payPalConfigProvider.get(false),
          regularTestPayPalConfig = payPalConfigProvider.get(true),
          defaultAmazonPayConfig = amazonPayConfigProvider.get(false),
          testAmazonPayConfig = amazonPayConfigProvider.get(true),
        ),
        v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(isTestUser).v2PublicKey,
        serversideTests = serversideTests,
        paymentApiUrl = paymentAPIService.paymentAPIUrl,
        paymentApiPayPalEndpoint = paymentAPIService.payPalCreatePaymentEndpoint,
        membersDataApiUrl = membersDataApiUrl,
        guestAccountCreationToken = guestAccountCreationToken,
        productCatalog = productCatalog,
        productPrices = productPrices,
        user = request.user,
      ),
    ).withSettingsSurrogateKey
  }

  def eventsRouter(countryGroupId: String, eventId: Option[String]) = authAction { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    Ok(views.html.eventsRouter()).withHeaders(CacheControl.noCache)
  }
}
