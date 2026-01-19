package controllers

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.CustomActionBuilders
import admin.ServersideAbTest.{Participation, generateParticipations}
import admin.settings.{AllSettings, AllSettingsProvider, On, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath}
import com.gu.i18n.CountryGroup
import com.gu.i18n.CountryGroup._
import com.gu.identity.model.{User => IdUser}
import com.gu.support.catalog.{DigitalPack, GuardianWeekly, Paper, SupporterPlus, TierThree}
import com.gu.support.config.Stages.PROD
import com.gu.support.config._
import com.gu.support.encoding.InternationalisationCodecs
import com.gu.support.zuora.api.ReaderType.Gift
import com.typesafe.scalalogging.StrictLogging
import config.{RecaptchaConfigProvider, StringsConfig}
import controllers.AppConfig.CsrfToken
import io.circe.generic.semiauto.deriveEncoder
import views.html.helper.CSRF
import io.circe.{Encoder, JsonObject}
import io.circe.syntax.EncoderOps
import lib.RedirectWithEncodedQueryString
import models.GeoData
import play.api.libs.circe.Circe
import play.api.mvc._
import services.mparticle.MParticleClient
import services.pricing.{PriceSummaryServiceProvider, ProductPrices}
import services.{CachedProductCatalogServiceProvider, PaymentAPIService, TestUserService, TickerService}
import utils.FastlyGEOIP._
import utils.{ObserverUtils, PaperValidation}
import views.EmptyDiv

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

case class AppConfig private (
    geoip: AppConfig.Geoip,
    stripeKeyDefaultCurrencies: AppConfig.StripeKeyConfig,
    stripeKeyAustralia: AppConfig.StripeKeyConfig,
    stripeKeyUnitedStates: AppConfig.StripeKeyConfig,
    stripeKeyTortoiseMedia: AppConfig.StripeKeyConfig,
    payPalEnvironment: AppConfig.ConfigKeyValues,
    paymentApiUrl: String,
    paymentApiPayPalEndpoint: String,
    mdapiUrl: String,
    csrf: AppConfig.CsrfToken,
    guestAccountCreationToken: Option[String],
    recaptchaEnabled: Boolean,
    v2recaptchaPublicKey: String,
    checkoutPostcodeLookup: Boolean,
    productCatalog: JsonObject,
    allProductPrices: AllProductPrices,
    serversideTests: Map[String, Participation],
    user: Option[AppConfig.User],
    settings: AllSettings,
)

// InternationalisationCodecs is needed for ProductPrices
object AppConfig extends InternationalisationCodecs {
  import io.circe.Encoder
  import io.circe.generic.semiauto.deriveEncoder
  import io.circe.JsonObject // This is needed for the JsonObject derivation
  implicit val geoipEncoder: Encoder[Geoip] = deriveEncoder
  implicit val configKeyValuesEncoder: Encoder[ConfigKeyValues] = deriveEncoder
  implicit val stripeKeyConfigEncoder: Encoder[StripeKeyConfig] = deriveEncoder
  implicit val csrfTokenEncoder: Encoder[CsrfToken] = deriveEncoder
  implicit val userEncoder: Encoder[User] = deriveEncoder
  implicit val guardianEncoder: Encoder[AppConfig] = deriveEncoder

  def fromConfig(
      geoData: GeoData,
      paymentMethodConfigs: PaymentMethodConfigs,
      paymentAPIService: PaymentAPIService,
      membersDataApiUrl: String,
      csrfToken: String,
      guestAccountCreationToken: Option[String],
      recaptchaConfigProvider: RecaptchaConfigProvider,
      productCatalog: JsonObject,
      serversideTests: Map[String, Participation],
      allProductPrices: AllProductPrices,
      user: Option[IdUser],
      isTestUser: Boolean,
      settings: AllSettings,
  ): AppConfig =
    AppConfig(
      geoip = Geoip(
        countryGroup = geoData.countryGroup.map(_.id).mkString,
        countryCode = geoData.country.map(_.alpha2).mkString,
        stateCode = geoData.validatedStateCodeForCountry.mkString,
      ),
      stripeKeyDefaultCurrencies = StripeKeyConfig(
        ONE_OFF = ConfigKeyValues(
          default = paymentMethodConfigs.oneOffDefaultStripeConfig.defaultAccount.rawPublicKey,
          test = paymentMethodConfigs.oneOffTestStripeConfig.defaultAccount.rawPublicKey,
        ),
        REGULAR = ConfigKeyValues(
          default = paymentMethodConfigs.regularDefaultStripeConfig.defaultAccount.rawPublicKey,
          test = paymentMethodConfigs.regularTestStripeConfig.defaultAccount.rawPublicKey,
        ),
      ),
      stripeKeyAustralia = StripeKeyConfig(
        ONE_OFF = ConfigKeyValues(
          default = paymentMethodConfigs.oneOffDefaultStripeConfig.australiaAccount.rawPublicKey,
          test = paymentMethodConfigs.oneOffTestStripeConfig.australiaAccount.rawPublicKey,
        ),
        REGULAR = ConfigKeyValues(
          default = paymentMethodConfigs.regularDefaultStripeConfig.australiaAccount.rawPublicKey,
          test = paymentMethodConfigs.regularTestStripeConfig.australiaAccount.rawPublicKey,
        ),
      ),
      stripeKeyUnitedStates = if (settings.switches.featureSwitches.usStripeAccountForSingle.contains(On)) {
        StripeKeyConfig(
          ONE_OFF = ConfigKeyValues(
            default = paymentMethodConfigs.oneOffDefaultStripeConfig.unitedStatesAccount.rawPublicKey,
            test = paymentMethodConfigs.oneOffTestStripeConfig.unitedStatesAccount.rawPublicKey,
          ),
          REGULAR = ConfigKeyValues(
            default = paymentMethodConfigs.regularDefaultStripeConfig.defaultAccount.rawPublicKey,
            test = paymentMethodConfigs.regularTestStripeConfig.defaultAccount.rawPublicKey,
          ),
        )
      } else {
        StripeKeyConfig(
          ONE_OFF = ConfigKeyValues(
            default = paymentMethodConfigs.oneOffDefaultStripeConfig.defaultAccount.rawPublicKey,
            test = paymentMethodConfigs.oneOffTestStripeConfig.defaultAccount.rawPublicKey,
          ),
          REGULAR = ConfigKeyValues(
            default = paymentMethodConfigs.regularDefaultStripeConfig.defaultAccount.rawPublicKey,
            test = paymentMethodConfigs.regularTestStripeConfig.defaultAccount.rawPublicKey,
          ),
        )
      },
      stripeKeyTortoiseMedia = StripeKeyConfig(
        ONE_OFF = ConfigKeyValues(
          default = paymentMethodConfigs.oneOffDefaultStripeConfig.tortoiseMediaAccount.rawPublicKey,
          test = paymentMethodConfigs.oneOffTestStripeConfig.tortoiseMediaAccount.rawPublicKey,
        ),
        REGULAR = ConfigKeyValues(
          default = paymentMethodConfigs.regularDefaultStripeConfig.tortoiseMediaAccount.rawPublicKey,
          test = paymentMethodConfigs.regularTestStripeConfig.tortoiseMediaAccount.rawPublicKey,
        ),
      ),
      ConfigKeyValues(
        default = paymentMethodConfigs.regularDefaultPayPalConfig.payPalEnvironment,
        test = paymentMethodConfigs.regularTestPayPalConfig.payPalEnvironment,
      ),
      paymentApiUrl = paymentAPIService.paymentAPIUrl,
      paymentApiPayPalEndpoint = paymentAPIService.payPalCreatePaymentEndpoint,
      mdapiUrl = membersDataApiUrl,
      csrf = CsrfToken(token = csrfToken),
      guestAccountCreationToken = guestAccountCreationToken,
      recaptchaEnabled = settings.switches.recaptchaSwitches.enableRecaptchaFrontend.contains(On),
      v2recaptchaPublicKey = recaptchaConfigProvider.get(isTestUser).v2PublicKey,
      checkoutPostcodeLookup = settings.switches.subscriptionsSwitches.checkoutPostcodeLookup.contains(On),
      productCatalog = productCatalog,
      serversideTests = serversideTests,
      allProductPrices = allProductPrices,
      user = user.map(user =>
        User(
          id = user.id,
          email = user.primaryEmailAddress,
          firstName = user.privateFields.firstName,
          lastName = user.privateFields.secondName,
        ),
      ),
      settings = settings,
    )

  case class Geoip(countryGroup: String, countryCode: String, stateCode: String)
  case class ConfigKeyValues(default: String, test: String)
  case class StripeKeyConfig(ONE_OFF: ConfigKeyValues, REGULAR: ConfigKeyValues)
  case class CsrfToken(token: String)
  case class User(id: String, email: String, firstName: Option[String], lastName: Option[String])
}

case class PaymentMethodConfigs(
    oneOffDefaultStripeConfig: StripePublicConfig,
    oneOffTestStripeConfig: StripePublicConfig,
    regularDefaultStripeConfig: StripePublicConfig,
    regularTestStripeConfig: StripePublicConfig,
    regularDefaultPayPalConfig: PayPalConfig,
    regularTestPayPalConfig: PayPalConfig,
)

/** This class is only needed because you can't pass more than 22 arguments to a twirl template and passing both types
  * of product prices to the contributions template would exceed that limit.
  *
  * We've also gone against the grain with Capitalising the prop names, but that's to match the ProductKeys in the
  * Product API.
  *
  * @see
  *   https://product-catalog.guardianapis.com/product-catalog.json
  */
case class AllProductPrices(
    SupporterPlus: ProductPrices,
    TierThree: ProductPrices,
    Paper: ProductPrices,
    GuardianWeekly: ProductPrices,
    GuardianWeeklyGift: ProductPrices,
    DigitalPack: ProductPrices,
)

object AllProductPrices extends InternationalisationCodecs {
  implicit val allProductPricesEncoder: Encoder[AllProductPrices] = deriveEncoder
}

class Application(
    actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    testUserService: TestUserService,
    components: ControllerComponents,
    oneOffStripeConfigProvider: StripePublicConfigProvider,
    regularStripeConfigProvider: StripePublicConfigProvider,
    payPalConfigProvider: PayPalConfigProvider,
    recaptchaConfigProvider: RecaptchaConfigProvider,
    paymentAPIService: PaymentAPIService,
    membersDataApiUrl: String,
    stringsConfig: StringsConfig,
    settingsProvider: AllSettingsProvider,
    stage: Stage,
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    cachedProductCatalogServiceProvider: CachedProductCatalogServiceProvider,
    val supportUrl: String,
    tickerService: TickerService,
    mparticleClient: MParticleClient,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with SettingsSurrogateKeySyntax
    with RegionalisedLinks
    with StrictLogging
    with Circe {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def getAllProductPrices(isTestUser: Boolean, queryPromos: List[String]): AllProductPrices = {
    AllProductPrices(
      SupporterPlus = priceSummaryServiceProvider.forUser(isTestUser).getPrices(SupporterPlus, queryPromos),
      TierThree = priceSummaryServiceProvider.forUser(isTestUser).getPrices(TierThree, queryPromos),
      Paper = priceSummaryServiceProvider.forUser(isTestUser).getPrices(Paper, queryPromos),
      GuardianWeekly = priceSummaryServiceProvider.forUser(isTestUser).getPrices(GuardianWeekly, queryPromos),
      GuardianWeeklyGift = priceSummaryServiceProvider.forUser(isTestUser).getPrices(GuardianWeekly, queryPromos, Gift),
      DigitalPack = priceSummaryServiceProvider.forUser(isTestUser).getPrices(DigitalPack, queryPromos),
    )
  }

  def geoRedirect: Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val redirectUrl = buildRegionalisedContributeLink(request.geoData.countryGroup match {
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
      buildRegionalisedContributeLink(supportPageVariant),
      request.queryString,
      status = FOUND,
    )
  }

  def contributeGeoRedirect(campaignCode: String): Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val url = getGeoPath(request, campaignCode, "contribute")
    RedirectWithEncodedQueryString(url, request.queryString, status = FOUND)
  }

  def checkoutGeoRedirect(campaignCode: String): Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val url = getGeoPath(request, campaignCode, "checkout")
    RedirectWithEncodedQueryString(url, request.queryString, status = FOUND)
  }

  def studentGeoRedirect(): Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val url = getGeoPath(request, "", "student")
    RedirectWithEncodedQueryString(url, request.queryString, status = FOUND)
  }

  def geoRedirectToPath(path: String): Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val url = getGeoPath(request, "", path)
    RedirectWithEncodedQueryString(url, request.queryString, status = FOUND)
  }

  private def getGeoPath(request: Request[AnyContent], campaignCode: String, product: String): String = {
    List(getGeoRedirectUrl(request.geoData.countryGroup, product), campaignCode)
      .filter(_.nonEmpty)
      .mkString("/")
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

  def contributionsLanding(
      countryCode: String,
      campaignCode: String,
  ): Action[AnyContent] = MaybeAuthenticatedAction { implicit request =>
    val campaignCodeOption = if (campaignCode != "") Some(campaignCode) else None

    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    Ok(
      contributionsPlusStudentHtml(
        countryCode,
        campaignCodeOption,
        "contributions",
        "https://support.theguardian.com/contribute",
        stage != PROD,
      ),
    ).withSettingsSurrogateKey
  }

  def studentLanding(
      countryCode: String,
      campaignCode: String,
  ): Action[AnyContent] = MaybeAuthenticatedAction { implicit request =>
    val campaignCodeOption = if (campaignCode != "") Some(campaignCode) else None
    val noIndexing = countryCode == "au"

    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    Ok(
      contributionsPlusStudentHtml(
        countryCode,
        campaignCodeOption,
        "student",
        "https://support.theguardian.com/student",
        noIndexing,
      ),
    ).withSettingsSurrogateKey
  }

  def downForMaintenance(): Action[AnyContent] = NoCacheAction() { implicit request =>
    Ok(
      views.html.main(
        "Support the Guardian | Down for essential maintenance",
        views.EmptyDiv("down-for-maintenance-page"),
        RefPath("downForMaintenancePage.js"),
        Some(RefPath("downForMaintenancePage.css")),
        noindex = stage != PROD,
      )()(assets, request, settingsProvider.getAllSettings()),
    ).withSettingsSurrogateKey
  }

  def unsupportedBrowser(): Action[AnyContent] = NoCacheAction() { implicit request =>
    Ok(
      views.html.main(
        "Support the Guardian | Un-supported browser",
        views.EmptyDiv("unsupported-browser-page"),
        RefPath("unsupportedBrowserPage.js"),
        None,
        noindex = stage != PROD,
      )()(assets, request, settingsProvider.getAllSettings()),
    ).withSettingsSurrogateKey
  }

  private def shareImageUrl(settings: AllSettings): String = {
    // Autumn 2021 generic image
    "https://i.guim.co.uk/img/media/5366cacfd2081e5a4af259318238b3f82610d32e/0_0_1000_525/1000.png?quality=85&s=966978166c0983aef68828559ede40d8"
  }

  private def contributionsPlusStudentHtml(
      countryCode: String,
      campaignCode: Option[String],
      pageName: String,
      canonicalUrl: String,
      noIndexing: Boolean,
  )(implicit request: OptionalAuthRequest[AnyContent], settings: AllSettings) = {
    val geoData = request.geoData
    val idUser = request.user

    // This will be present if the token has been flashed into the session by the PayPal redirect endpoint
    val guestAccountCreationToken = request.flash.get("guestAccountCreationToken")

    val classes = s"gu-content--$pageName-form--placeholder" +
      campaignCode.map(code => s" gu-content--campaign-landing gu-content--$code").getOrElse("")

    val ssrCachePageName = if (pageName == "contributions") "supporter-plus" else pageName

    val mainElement = assets.getSsrCacheContentsAsHtml(
      divId = s"$ssrCachePageName-landing-page-$countryCode",
      file = "ssr-holding-content.html",
      classes = Some(classes),
    )

    val serversideTests = generateParticipations(Nil)
    val isTestUser = testUserService.isTestUser(request)

    val queryPromos =
      request.queryString
        .getOrElse("promoCode", Nil)
        .toList

    val allProductPrices = getAllProductPrices(isTestUser, queryPromos)

    val productCatalog = cachedProductCatalogServiceProvider.fromStage(stage, isTestUser).get()
    // We want the canonical link to point to the geo-redirect page so that users arriving from
    // search will be redirected to the correct version of the page
    val canonicalLink = s"$canonicalUrl"

    views.html.contributions(
      id = s"$pageName-landing-page-$countryCode",
      mainElement = mainElement,
      js = RefPath("[countryGroupId]/router.js"),
      description =
        if (pageName.startsWith("student")) stringsConfig.studentLandingDescription
        else stringsConfig.contributionsLandingDescription,
      paymentMethodConfigs = PaymentMethodConfigs(
        oneOffDefaultStripeConfig = oneOffStripeConfigProvider.get(false),
        oneOffTestStripeConfig = oneOffStripeConfigProvider.get(true),
        regularDefaultStripeConfig = regularStripeConfigProvider.get(false),
        regularTestStripeConfig = regularStripeConfigProvider.get(true),
        regularDefaultPayPalConfig = payPalConfigProvider.get(false),
        regularTestPayPalConfig = payPalConfigProvider.get(true),
      ),
      paymentApiUrl = paymentAPIService.paymentAPIUrl,
      paymentApiPayPalEndpoint = paymentAPIService.payPalCreatePaymentEndpoint,
      membersDataApiUrl = membersDataApiUrl,
      idUser = idUser,
      guestAccountCreationToken = guestAccountCreationToken,
      geoData = geoData,
      shareImageUrl = shareImageUrl(settings),
      v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(isTestUser).v2PublicKey,
      serversideTests = serversideTests,
      allProductPrices = allProductPrices,
      productCatalog = productCatalog,
      noIndex = noIndexing,
      canonicalLink = canonicalLink,
      tickerData = tickerService.getTickers(),
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
        noindex = stage != PROD,
      )(),
    ).withSettingsSurrogateKey
  }

  def healthcheck: Action[AnyContent] = PrivateAction {
    mparticleClient.initialise()
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

  def getProductParamsFromContributionParams(
      countryGroupId: String,
      productCatalog: JsonObject,
      queryString: Map[String, Seq[String]],
  ) = {
    val maybeSelectedContributionType = queryString
      .get("selected-contribution-type")
      .flatMap(_.headOption)
      .map(_.toLowerCase)

    val maybeSelectedAmount = queryString
      .get("selected-amount")
      .flatMap(_.headOption)
      .map(s => Try(s.toInt))
      .flatMap(_.toOption)

    val currency = CountryGroup.byId(countryGroupId).getOrElse(CountryGroup.UK).currency.iso
    val isAnnual = maybeSelectedContributionType.contains("annual")
    val ratePlan = if (isAnnual) "Annual" else "Monthly"
    val maybeSupporterPlusAmount = productCatalog.asJson.hcursor
      .downField("SupporterPlus")
      .downField("ratePlans")
      .downField(ratePlan)
      .downField("pricing")
      .downField(currency)
      .as[Double]
      .toOption

    val isSupporterPlus: Boolean = (for {
      supporterPlusAmount <- maybeSupporterPlusAmount
      selectedAmount <- maybeSelectedAmount
    } yield selectedAmount >= supporterPlusAmount).getOrElse(true)

    val isOneOff = maybeSelectedContributionType.contains("one_off")
    if (isOneOff) {
      ("OneOff", "OneOff", maybeSelectedAmount)
    } else if (isSupporterPlus) {
      ("SupporterPlus", ratePlan, None)
    } else {
      ("Contribution", ratePlan, maybeSelectedAmount)
    }
  }

  def redirectContributionsCheckout(countryGroupId: String) = MaybeAuthenticatedAction { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()

    val isTestUser = testUserService.isTestUser(request)
    val productCatalog = cachedProductCatalogServiceProvider.fromStage(stage, isTestUser).get()

    val (product, ratePlan, maybeSelectedAmount) =
      getProductParamsFromContributionParams(countryGroupId, productCatalog, request.queryString)

    val qsWithoutTypeAndAmount = request.queryString - "selected-contribution-type" - "selected-amount"

    if (product == "OneOff") {
      val queryStringMaybeWithContributionAmount = maybeSelectedAmount
        .map(selectedAmount => qsWithoutTypeAndAmount + ("contribution" -> Seq(selectedAmount.toString)))
        .getOrElse(qsWithoutTypeAndAmount)

      Redirect(s"/$countryGroupId/one-time-checkout", queryStringMaybeWithContributionAmount, MOVED_PERMANENTLY)
    } else {
      val queryString = qsWithoutTypeAndAmount ++ Map(
        "product" -> Seq(product),
        "ratePlan" -> Seq(ratePlan),
      )

      val queryStringMaybeWithContributionAmount = maybeSelectedAmount
        .map(selectedAmount => queryString + ("contribution" -> Seq(selectedAmount.toString)))
        .getOrElse(queryString)

      Redirect(s"/$countryGroupId/checkout", queryStringMaybeWithContributionAmount, MOVED_PERMANENTLY)
    }
  }

  def redirectContributionsCheckoutDigital(countryGroupId: String) = {
    redirectToCheckout(countryGroupId, "DigitalSubscription", "Monthly")
  }

  def redirectCheckoutPaper(fulfilment: String, product: String) = {
    redirectToCheckout("uk", fulfilment, product)
  }

  def redirectToCheckout(countryGroupId: String, product: String, ratePlan: String) = MaybeAuthenticatedAction {
    implicit request =>
      implicit val settings: AllSettings = settingsProvider.getAllSettings()

      val qsWithoutTypeAndAmount =
        request.queryString - "selected-contribution-type" - "selected-amount" - "fulfilment"
      val queryString = qsWithoutTypeAndAmount ++ Map(
        "product" -> Seq(product),
        "ratePlan" -> Seq(ratePlan),
      )

      Redirect(s"/$countryGroupId/checkout", queryString, MOVED_PERMANENTLY)
  }

  def productCheckoutRouter(countryGroupId: String) = MaybeAuthenticatedAction { implicit request =>
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

    val allProductPrices = getAllProductPrices(isTestUser, queryPromos)

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
        ),
        v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(isTestUser).v2PublicKey,
        serversideTests = serversideTests,
        paymentApiUrl = paymentAPIService.paymentAPIUrl,
        paymentApiPayPalEndpoint = paymentAPIService.payPalCreatePaymentEndpoint,
        membersDataApiUrl = membersDataApiUrl,
        guestAccountCreationToken = guestAccountCreationToken,
        productCatalog = productCatalog,
        allProductPrices = allProductPrices,
        user = request.user,
        homeDeliveryPostcodes = Some(PaperValidation.M25_POSTCODE_PREFIXES),
      ),
    ).withSettingsSurrogateKey
  }

  def eventsRouter(countryGroupId: String, eventId: String) = MaybeAuthenticatedAction { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    Ok(
      views.html.eventsRouter(
        user = request.user,
      ),
    ).withSettingsSurrogateKey
  }

  def appConfigJson: Action[AnyContent] = MaybeAuthenticatedAction { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val isTestUser = testUserService.isTestUser(request)

    val queryPromos = request.queryString.getOrElse("promoCode", Nil).toList
    val allProductPrices = getAllProductPrices(isTestUser, queryPromos)

    val appConfig = AppConfig.fromConfig(
      geoData = request.geoData,
      paymentMethodConfigs = PaymentMethodConfigs(
        oneOffDefaultStripeConfig = oneOffStripeConfigProvider.get(false),
        oneOffTestStripeConfig = oneOffStripeConfigProvider.get(true),
        regularDefaultStripeConfig = regularStripeConfigProvider.get(false),
        regularTestStripeConfig = regularStripeConfigProvider.get(true),
        regularDefaultPayPalConfig = payPalConfigProvider.get(false),
        regularTestPayPalConfig = payPalConfigProvider.get(true),
      ),
      paymentAPIService = paymentAPIService,
      membersDataApiUrl = membersDataApiUrl,
      csrfToken = CsrfToken(CSRF.getToken.value).token,
      // This will be present if the token has been flashed into the session by the PayPal redirect endpoint
      guestAccountCreationToken = request.flash.get("guestAccountCreationToken"),
      recaptchaConfigProvider: RecaptchaConfigProvider,
      productCatalog = cachedProductCatalogServiceProvider.fromStage(stage, isTestUser).get(),
      serversideTests = generateParticipations(Nil),
      allProductPrices = allProductPrices,
      user = request.user,
      isTestUser = isTestUser,
      settings = settings,
    )
    Ok(appConfig.asJson)
  }
}
