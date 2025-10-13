package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath}
import com.gu.i18n.CountryGroup
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog._
import com.gu.support.config.Stage
import com.gu.support.config.Stages.PROD
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.workers.Monthly
import config.StringsConfig
import lib.RedirectWithEncodedQueryString
import play.api.mvc._
import play.twirl.api.Html
import services.CachedProductCatalogServiceProvider
import services.pricing.{PriceSummary, PriceSummaryServiceProvider}
import views.EmptyDiv
import views.ViewHelpers.outputJson

import scala.concurrent.ExecutionContext

class SubscriptionsController(
    val actionRefiners: CustomActionBuilders,
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    val assets: AssetsResolver,
    components: ControllerComponents,
    stringsConfig: StringsConfig,
    settingsProvider: AllSettingsProvider,
    val supportUrl: String,
    stage: Stage,
    cachedProductCatalogServiceProvider: CachedProductCatalogServiceProvider,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with GeoRedirect
    with RegionalisedLinks
    with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def geoRedirect: Action[AnyContent] = geoRedirect("subscribe")

  def legacyRedirect(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    // Country code is required here because it's a parameter in the route.
    // But we don't actually use it.
    RedirectWithEncodedQueryString("https://subscribe.theguardian.com", request.queryString, status = FOUND)
  }

  case class PriceCopy(price: BigDecimal, discountCopy: String)
  object PriceCopy {
    implicit val codec: com.gu.support.encoding.Codec[PriceCopy] = deriveCodec
  }

  def pricingCopy(priceSummary: PriceSummary): PriceCopy = {
    val price = for {
      promo <- priceSummary.promotions.headOption
      discountedPrice <- promo.discountedPrice
    } yield discountedPrice
    PriceCopy(
      price.getOrElse(priceSummary.price),
      priceSummary.promotions.headOption.map(_.description).getOrElse(""),
    )
  }

  def getLandingPrices(countryGroup: CountryGroup): Map[String, PriceCopy] = {
    val service = priceSummaryServiceProvider.forUser(false)
    val paperMap = if (countryGroup == CountryGroup.UK) {
      val paper = service.getPrices(Paper, Nil)(CountryGroup.UK)(Collection)(
        SaturdayPlus,
      )(Monthly)(GBP)
      Map(Paper.toString -> pricingCopy(paper))
    } else
      Map.empty

    val guardianWeeklyFulfilmentOptions = if (countryGroup == CountryGroup.RestOfTheWorld) RestOfWorld else Domestic

    val weekly =
      service.getPrices(
        GuardianWeekly,
        Nil,
      )(countryGroup)(guardianWeeklyFulfilmentOptions)(NoProductOptions)(Monthly)(
        countryGroup.currency,
      )

    val digitalSubscription = service
      .getPrices(
        DigitalPack,
        Nil,
      )(countryGroup)(NoFulfilmentOptions)(NoProductOptions)(Monthly)(countryGroup.currency)

    Map(
      GuardianWeekly.toString -> pricingCopy(weekly),
      DigitalPack.toString -> pricingCopy(digitalSubscription),
    ) ++ paperMap
  }

  def landing(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | Get a Subscription"
    val mainElement = EmptyDiv("subscriptions-landing-page")
    val js = "subscriptionsLandingPage.js"
    val pricingCopy = CountryGroup.byId(countryCode).map(getLandingPrices)
    // TestUser remains un-used, page caching preferred
    val productCatalog = cachedProductCatalogServiceProvider.fromStage(stage, false).get()
    Ok(
      views.html.main(
        title,
        mainElement,
        RefPath(js),
        Some(RefPath("subscriptionsLandingPage.css")),
        description = stringsConfig.subscriptionsLandingDescription,
        noindex = stage != PROD,
      ) {
        Html(s"""<script type="text/javascript">
              window.guardian.pricingCopy = ${outputJson(pricingCopy)};
              window.guardian.productCatalog = ${outputJson(productCatalog)}
            </script>""")
      },
    ).withSettingsSurrogateKey
  }

}
