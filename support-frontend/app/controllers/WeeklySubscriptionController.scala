package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.encoding.CustomCodecs._
import services.pricing.PriceSummaryServiceProvider
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import config.StringsConfig
import play.api.mvc._
import play.twirl.api.Html
import views.EmptyDiv
import views.ViewHelpers.outputJson
import com.typesafe.scalalogging.StrictLogging

import scala.concurrent.ExecutionContext

class WeeklySubscriptionController(
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    landingCopyProvider: LandingCopyProvider,
    val assets: AssetsResolver,
    val actionRefiners: CustomActionBuilders,
    components: ControllerComponents,
    stringsConfig: StringsConfig,
    settingsProvider: AllSettingsProvider,
    val supportUrl: String,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with GeoRedirect
    with CanonicalLinks
    with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def weeklyGeoRedirect(orderIsAGift: Boolean = false): Action[AnyContent] = geoRedirect(
    if (orderIsAGift) "subscribe/weekly/gift" else "subscribe/weekly",
  )

  def weekly(countryCode: String, orderIsAGift: Boolean): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val canonicalLink = Some(buildCanonicalWeeklySubscriptionLink("uk", orderIsAGift))

    val queryPromos =
      request.queryString
        .getOrElse("promoCode", Nil)
        .toList
    val defaultPromos = priceSummaryServiceProvider.forUser(isTestUser = false).getDefaultPromoCodes(GuardianWeekly)
    val maybePromotionCopy =
      landingCopyProvider.promotionCopy(queryPromos ++ defaultPromos, GuardianWeekly, countryCode)
    Ok(
      views.html.main(
        title =
          if (orderIsAGift) "The Guardian Weekly Gift Subscription | The Guardian"
          else "The Guardian Weekly Subscriptions | The Guardian",
        mainElement = EmptyDiv("weekly-landing-page-" + countryCode),
        mainJsBundle = Left(RefPath("weeklySubscriptionLandingPage.js")),
        mainStyleBundle = Left(RefPath("weeklySubscriptionLandingPage.css")),
        description = stringsConfig.weeklyLandingDescription,
        canonicalLink = canonicalLink,
        hrefLangLinks = getWeeklyHrefLangLinks(orderIsAGift),
        shareImageUrl = Some(
          "https://i.guim.co.uk/img/media/00cb294c1f1e5140c63008d7a55b105ef2a786e6/0_0_1200_1200/1200.jpg" +
            "?width=1200&height=1200&quality=85&auto=format&fit=crop&s=0034a6a7408ca4d162620f2c8b6bf2b9",
        ),
        shareUrl = canonicalLink,
      ) {
        Html(s"""<script type="text/javascript">
              window.guardian.productPrices = ${outputJson(productPrices(queryPromos, orderIsAGift))}
              window.guardian.promotionCopy = ${outputJson(maybePromotionCopy)}
              window.guardian.orderIsAGift = $orderIsAGift
            </script>""")
      },
    ).withSettingsSurrogateKey
  }

  private def getWeeklyHrefLangLinks(orderIsAGift: Boolean): Map[String, String] = Map(
    "en-us" -> buildCanonicalWeeklySubscriptionLink("us", orderIsAGift),
    "en-gb" -> buildCanonicalWeeklySubscriptionLink("uk", orderIsAGift),
    "en-au" -> buildCanonicalWeeklySubscriptionLink("au", orderIsAGift),
    "en-nz" -> buildCanonicalWeeklySubscriptionLink("nz", orderIsAGift),
    "en-ca" -> buildCanonicalWeeklySubscriptionLink("ca", orderIsAGift),
    "en" -> buildCanonicalWeeklySubscriptionLink("int", orderIsAGift),
    "en" -> buildCanonicalWeeklySubscriptionLink("eu", orderIsAGift),
  )

  private def productPrices(queryPromos: List[String], orderIsAGift: Boolean) = {
    val readerType = if (orderIsAGift) Gift else Direct
    priceSummaryServiceProvider.forUser(false).getPrices(GuardianWeekly, queryPromos, readerType)
  }

}
