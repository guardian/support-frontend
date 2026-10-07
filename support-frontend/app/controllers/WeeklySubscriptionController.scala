package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.i18n.CountryGroup
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.config.Stage
import com.gu.support.config.Stages.PROD
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromoWithCatalogInformation
import services.{ApplicablePromotions, CachedProductCatalogServiceProvider, CachedPromotionsServiceProvider}
import services.pricing.DefaultPromotionService
import config.StringsConfig
import play.api.mvc._
import play.twirl.api.Html
import views.EmptyDiv
import views.ViewHelpers.outputJson

import scala.concurrent.ExecutionContext

class WeeklySubscriptionController(
    defaultPromotionService: DefaultPromotionService,
    cachedPromotionsServiceProvider: CachedPromotionsServiceProvider,
    cachedProductCatalogServiceProvider: CachedProductCatalogServiceProvider,
    val assets: AssetsResolver,
    val actionRefiners: CustomActionBuilders,
    components: ControllerComponents,
    stringsConfig: StringsConfig,
    settingsProvider: AllSettingsProvider,
    val supportUrl: String,
    stage: Stage,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with GeoRedirect
    with RegionalisedLinks
    with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def weeklyGeoRedirect(orderIsAGift: Boolean = false): Action[AnyContent] = geoRedirect(
    if (orderIsAGift) "subscribe/weekly/gift" else "subscribe/weekly",
  )

  def weekly(countryGroupId: String, orderIsAGift: Boolean): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    // We want the canonical link to point to the geo-redirect page so that users arriving from
    // search will be redirected to the correct version of the page
    val canonicalLink = Some(if (orderIsAGift) "/subscribe/weekly/gift" else "/subscribe/weekly")

    val queryPromos =
      request.queryString
        .getOrElse("promoCode", Nil)
        .toList
    val defaultPromos = defaultPromotionService.getPromoCodes(GuardianWeekly)
    val promotions = getPromotions(queryPromos ++ defaultPromos, countryGroupId, orderIsAGift)
    val productCatalog = cachedProductCatalogServiceProvider.fromStage(stage, isTestUser = false).get()

    Ok(
      views.html.main(
        title =
          if (orderIsAGift) "The Guardian Weekly Gift Subscription | The Guardian"
          else "The Guardian Weekly Subscriptions | The Guardian",
        mainElement = EmptyDiv("weekly-landing-page-" + countryGroupId),
        mainJsBundle = RefPath("weeklySubscriptionLandingPage.js"),
        mainStyleBundle = None,
        description = stringsConfig.weeklyLandingDescription,
        canonicalLink = canonicalLink,
        hrefLangLinks = getWeeklyHrefLangLinks(orderIsAGift),
        shareImageUrl = Some(
          "https://i.guim.co.uk/img/media/315599b90256ba9c5574037d94841edbe7f435c9/0_0_4740_3552/master/4740.png?dpr=1&s=none&width=1200",
        ),
        shareUrl = canonicalLink,
        noindex = stage != PROD,
      ) {
        Html(s"""<script type="text/javascript">
              window.guardian.orderIsAGift = $orderIsAGift
              window.guardian.promotions = ${outputJson(promotions)}
              window.guardian.productCatalog = ${outputJson(productCatalog, dropNullValues = false)}
            </script>""")
      },
    ).withSettingsSurrogateKey
  }

  private def getPromotions(
      promoCodes: List[String],
      countryGroupId: String,
      orderIsAGift: Boolean,
  ): Seq[PromoWithCatalogInformation] =
    CountryGroup
      .byId(countryGroupId)
      .map { countryGroup =>
        val promotions = cachedPromotionsServiceProvider.forUser(isTestUser = false).getActive(promoCodes.distinct)
        ApplicablePromotions.filter(promotions, Set(guardianWeeklyProductKey(countryGroup)), orderIsAGift, countryGroup)
      }
      .getOrElse(Nil)

  private def guardianWeeklyProductKey(countryGroup: CountryGroup): String =
    if (countryGroup == CountryGroup.RestOfTheWorld) "GuardianWeeklyRestOfWorld" else "GuardianWeeklyDomestic"

  private def getWeeklyHrefLangLinks(orderIsAGift: Boolean): Map[String, String] = Map(
    "en-us" -> buildRegionalisedWeeklySubscriptionLink("us", orderIsAGift),
    "en-gb" -> buildRegionalisedWeeklySubscriptionLink("uk", orderIsAGift),
    "en-au" -> buildRegionalisedWeeklySubscriptionLink("au", orderIsAGift),
    "en-nz" -> buildRegionalisedWeeklySubscriptionLink("nz", orderIsAGift),
    "en-ca" -> buildRegionalisedWeeklySubscriptionLink("ca", orderIsAGift),
    "en" -> buildRegionalisedWeeklySubscriptionLink("int", orderIsAGift),
    "en" -> buildRegionalisedWeeklySubscriptionLink("eu", orderIsAGift),
  )

}
