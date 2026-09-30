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
import services.pricing.PriceSummaryServiceProvider
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import config.StringsConfig
import play.api.mvc._
import play.twirl.api.Html
import views.EmptyDiv
import views.ViewHelpers.outputJson

import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NonFatal

class WeeklySubscriptionController(
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    landingCopyProvider: LandingCopyProvider,
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

  def weekly(countryGroupId: String, orderIsAGift: Boolean): Action[AnyContent] = CachedAction().async {
    implicit request =>
      implicit val settings: AllSettings = settingsProvider.getAllSettings()
      // We want the canonical link to point to the geo-redirect page so that users arriving from
      // search will be redirected to the correct version of the page
      val canonicalLink = Some(if (orderIsAGift) "/subscribe/weekly/gift" else "/subscribe/weekly")

      val queryPromos =
        request.queryString
          .getOrElse("promoCode", Nil)
          .toList
      val defaultPromos = priceSummaryServiceProvider.forUser(isTestUser = false).getDefaultPromoCodes(GuardianWeekly)
      val maybePromotionCopy =
        landingCopyProvider.promotionCopy(queryPromos ++ defaultPromos, GuardianWeekly, countryGroupId, orderIsAGift)
      val productCatalog = cachedProductCatalogServiceProvider.fromStage(stage, isTestUser = false).get()

      getPromotions(queryPromos ++ defaultPromos, countryGroupId, orderIsAGift).map { promotions =>
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
              window.guardian.productPrices = ${outputJson(productPrices(queryPromos, orderIsAGift))}
              window.guardian.promotionCopy = ${outputJson(maybePromotionCopy)}
              window.guardian.orderIsAGift = $orderIsAGift
              window.guardian.promotions = ${outputJson(promotions)}
              window.guardian.productCatalog = ${outputJson(productCatalog, dropNullValues = false)}
            </script>""")
          },
        ).withSettingsSurrogateKey
      }
  }

  /** The promotions which can be applied on this page. Promotions are served from the cache where possible; if a code
    * isn't cached and promotions-api is unavailable we render the page without promotions rather than failing.
    */
  private def getPromotions(
      promoCodes: List[String],
      countryGroupId: String,
      orderIsAGift: Boolean,
  ): Future[Seq[PromoWithCatalogInformation]] =
    CountryGroup
      .byId(countryGroupId)
      .map { countryGroup =>
        cachedPromotionsServiceProvider
          .forUser(isTestUser = false)
          .get(promoCodes.distinct)
          .map(ApplicablePromotions.filter(_, Set(guardianWeeklyProductKey(countryGroup)), orderIsAGift, countryGroup))
          .recover { case NonFatal(_) => Nil }
      }
      .getOrElse(Future.successful(Nil))

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

  private def productPrices(queryPromos: List[String], orderIsAGift: Boolean) = {
    val readerType = if (orderIsAGift) Gift else Direct
    priceSummaryServiceProvider.forUser(false).getPrices(GuardianWeekly, queryPromos, readerType)
  }

}
