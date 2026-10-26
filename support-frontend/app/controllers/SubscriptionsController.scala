package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath}
import com.gu.i18n.CountryGroup
import com.gu.support.catalog.{DigitalPack, GuardianWeekly, Paper}
import com.gu.support.config.Stage
import com.gu.support.config.Stages.PROD
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.{CatalogRatePlan, PromoWithCatalogInformation}
import config.StringsConfig
import lib.RedirectWithEncodedQueryString
import play.api.mvc._
import play.twirl.api.Html
import services.{ApplicablePromotions, CachedProductCatalogServiceProvider, CachedPromotionsServiceProvider}
import services.pricing.DefaultPromotionService
import views.EmptyDiv
import views.ViewHelpers.outputJson

import scala.concurrent.ExecutionContext

class SubscriptionsController(
    val actionRefiners: CustomActionBuilders,
    defaultPromotionService: DefaultPromotionService,
    cachedPromotionsServiceProvider: CachedPromotionsServiceProvider,
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

  private def getPromotions(countryGroup: CountryGroup): Seq[PromoWithCatalogInformation] = {
    val productKeys = Set(CatalogRatePlan.guardianWeeklyProductKey(countryGroup), "DigitalSubscription") ++
      (if (countryGroup == CountryGroup.UK) CatalogRatePlan.paperProductKeys else Set.empty)

    val promoCodes = (
      defaultPromotionService.getPromoCodes(GuardianWeekly) ++
        defaultPromotionService.getPromoCodes(DigitalPack) ++
        defaultPromotionService.getPromoCodes(Paper)
    ).distinct

    val promotions = cachedPromotionsServiceProvider.forUser(isTestUser = false).getActive(promoCodes)
    ApplicablePromotions.filter(promotions, productKeys, isGift = false, countryGroup)
  }

  def landing(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | Get a Subscription"
    val mainElement = EmptyDiv("subscriptions-landing-page")
    val js = "subscriptionsLandingPage.js"
    val promotions = CountryGroup.byId(countryCode).map(getPromotions).getOrElse(Nil)
    // TestUser remains un-used, page caching preferred
    val productCatalog = cachedProductCatalogServiceProvider.fromStage(stage, false).get()
    Ok(
      views.html.main(
        title,
        mainElement,
        RefPath(js),
        None,
        description = stringsConfig.subscriptionsLandingDescription,
        noindex = stage != PROD,
      ) {
        Html(s"""<script type="text/javascript">
              window.guardian.promotions = ${outputJson(promotions)};
              window.guardian.productCatalog = ${outputJson(productCatalog, dropNullValues = false)}
            </script>""")
      },
    ).withSettingsSurrogateKey
  }

}
