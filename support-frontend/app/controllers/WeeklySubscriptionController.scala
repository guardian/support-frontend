package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.pricing.PriceSummaryServiceProvider
import com.gu.support.promotions.DefaultPromotions
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import config.StringsConfig
import play.api.mvc._
import play.api.libs.ws._
import play.api.http.ContentTypes._
import play.api.libs.json._
import play.twirl.api.Html
import views.EmptyDiv
import views.ViewHelpers.outputJson

import scala.concurrent.{Await,ExecutionContext,Future}
import scala.concurrent.duration._

class WeeklySubscriptionController(
  priceSummaryServiceProvider: PriceSummaryServiceProvider,
  landingCopyProvider: LandingCopyProvider,
  val assets: AssetsResolver,
  val actionRefiners: CustomActionBuilders,
  components: ControllerComponents,
  stringsConfig: StringsConfig,
  settingsProvider: AllSettingsProvider,
  val supportUrl: String,
  fontLoaderBundle: Either[RefPath, StyleContent],
  ws: WSClient
)(implicit val ec: ExecutionContext) extends AbstractController(components) with GeoRedirect with CanonicalLinks with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def weeklyGeoRedirect(orderIsAGift: Boolean = false): Action[AnyContent] = geoRedirect(
    if (orderIsAGift) "subscribe/weekly/gift" else "subscribe/weekly"
  )

  def weekly(countryCode: String, orderIsAGift: Boolean): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val canonicalLink = Some(buildCanonicalWeeklySubscriptionLink("uk", orderIsAGift))
    val queryPromos = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
    val maybePromotionCopy = landingCopyProvider.promotionCopy(queryPromos, GuardianWeekly, countryCode, DefaultPromotions.GuardianWeekly.landing)

    // Ok(views.html.main(
    //   title = if (orderIsAGift) "The Guardian Weekly Gift Subscription | The Guardian" else "The Guardian Weekly Subscriptions | The Guardian",
    //   mainElement = EmptyDiv("weekly-landing-page-" + countryCode),
    //   mainJsBundle = Left(RefPath("weeklySubscriptionLandingPage.js")),
    //   mainStyleBundle = Left(RefPath("weeklySubscriptionLandingPage.css")),
    //   fontLoaderBundle = fontLoaderBundle,
    //   description = stringsConfig.weeklyLandingDescription,
    //   canonicalLink = canonicalLink,
    //   hrefLangLinks = getWeeklyHrefLangLinks(orderIsAGift),
    //   shareImageUrl = Some(
    //     "https://i.guim.co.uk/img/media/00cb294c1f1e5140c63008d7a55b105ef2a786e6/0_0_1200_1200/1200.jpg" +
    //       "?width=1200&height=1200&quality=85&auto=format&fit=crop&s=0034a6a7408ca4d162620f2c8b6bf2b9"
    //   ),
    //   shareUrl = canonicalLink
    // ) {
    //   Html(
    //     s"""<script type="text/javascript">
    //           window.guardian.productPrices = ${outputJson(productPrices(queryPromos, orderIsAGift))}
    //           window.guardian.promotionCopy = ${outputJson(maybePromotionCopy)}
    //           window.guardian.orderIsAGift = $orderIsAGift
    //         </script>""")
    // }).withSettingsSurrogateKey

    val url = "http://localhost:3000/weekly"

    val hero = maybePromotionCopy.map(copy => Json.obj(
      "title" -> "The Guardian Weekly",
      "roundelText" -> s"${copy.roundel.getOrElse("")}",
      "subtitle" -> s"${copy.title.getOrElse("")}",
      "copy" -> s"<p>${copy.description.getOrElse("")}</p>",
      "buttonCopy" -> "See pricing options",
    )).getOrElse(Json.obj(
          "title" -> "The Guardian Weekly",
          "roundelText" -> "Try <div class=\"center-line\">6 issues</div> for £6",
          "subtitle" -> "<span>Find clarity with The Guardian&apos;s global magazine</span>",
          "copy" -> """<p>The Guardian Weekly magazine is a round-up of the world news, opinion
            and long reads that have shaped the week. Inside, the past seven
            days&amp; most memorable stories are reframed with striking photography
            and insightful companion pieces, all handpicked from The Guardian and
            The Observer.</p>""",
          "buttonCopy" -> "See pricing options",
        ))

    val data = Json.obj(
      "page" -> Json.obj(
        "hero" -> hero,
        "prices" -> outputJson(productPrices(queryPromos, orderIsAGift)),
        "countryCode" -> countryCode
      )
    )

    val futureResponse: Future[WSResponse] = ws.url(url).post(data)

    val page: Future[Result] = futureResponse.map(
      pageResult => Ok(pageResult.body)
          .as(HTML)
          .withSettingsSurrogateKey
    )

    Await.result(page, Duration(100, MILLISECONDS))
  }

  private def getWeeklyHrefLangLinks(orderIsAGift: Boolean): Map[String, String] = Map(
    "en-us" -> buildCanonicalWeeklySubscriptionLink("us", orderIsAGift),
    "en-gb" -> buildCanonicalWeeklySubscriptionLink("uk", orderIsAGift),
    "en-au" -> buildCanonicalWeeklySubscriptionLink("au", orderIsAGift),
    "en-nz" -> buildCanonicalWeeklySubscriptionLink("nz", orderIsAGift),
    "en-ca" -> buildCanonicalWeeklySubscriptionLink("ca", orderIsAGift),
    "en" -> buildCanonicalWeeklySubscriptionLink("int", orderIsAGift),
    "en" -> buildCanonicalWeeklySubscriptionLink("eu", orderIsAGift)
  )

  private def productPrices(queryPromos: List[String], orderIsAGift: Boolean) = {
    val defaultPromos = if (orderIsAGift)
      DefaultPromotions.GuardianWeekly.Gift.all
    else
      DefaultPromotions.GuardianWeekly.NonGift.all
    val promoCodes = defaultPromos ++ queryPromos
    val readerType = if (orderIsAGift) Gift else Direct
    priceSummaryServiceProvider.forUser(false).getPrices(GuardianWeekly, promoCodes, readerType)
  }

}
