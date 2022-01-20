package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath}
import com.gu.i18n.CountryGroup
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.GuardianWeekly.postIntroductorySixForSixBillingPeriod
import com.gu.support.catalog._
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.pricing.{PriceSummary, PriceSummaryServiceProvider}
import com.gu.support.promotions.DefaultPromotions
import com.gu.support.workers.Monthly
import config.StringsConfig
import lib.RedirectWithEncodedQueryString
import play.api.mvc._
import play.twirl.api.Html
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
  val supportUrl: String
)(implicit val ec: ExecutionContext) extends AbstractController(components) with GeoRedirect with CanonicalLinks with SettingsSurrogateKeySyntax {

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
    implicit val codec : com.gu.support.encoding.Codec[PriceCopy] = deriveCodec
  }

  def pricingCopy(priceSummary: PriceSummary): PriceCopy =
    PriceCopy(
      priceSummary.price,
      priceSummary.promotions.headOption.map(_.description).getOrElse("")
    )

  def getLandingPrices(countryGroup: CountryGroup): Map[String, PriceCopy] = {
    val service = priceSummaryServiceProvider.forUser(false)

    val paperMap = if (countryGroup == CountryGroup.UK) {
      val paper = service.getPrices(Paper, List(DefaultPromotions.Paper.june21Promotion))(CountryGroup.UK)(Collection)(Sunday)(Monthly)(GBP)
      Map(Paper.toString -> pricingCopy(paper))
    }
    else
      Map.empty

    val fulfilmentOptions = if (countryGroup == CountryGroup.RestOfTheWorld) RestOfWorld else Domestic
    val weekly =
      service.getPrices(GuardianWeekly, Nil)(countryGroup)(fulfilmentOptions)(NoProductOptions)(postIntroductorySixForSixBillingPeriod)(countryGroup.currency)

    val digitalSubscription = service
      .getPrices(
        DigitalPack,
        List(DefaultPromotions.DigitalSubscription.Monthly.fiftyPercentOff3Months)
      )(countryGroup)(NoFulfilmentOptions)(NoProductOptions)(Monthly)(countryGroup.currency)

    Map(
      GuardianWeekly.toString -> pricingCopy(weekly),
      DigitalPack.toString -> pricingCopy(digitalSubscription)
    ) ++ paperMap
  }

  def landing(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | Get a Subscription"
    val mainElement = EmptyDiv("subscriptions-landing-page")
    val js = "subscriptionsLandingPage.js"
    val pricingCopy = CountryGroup.byId(countryCode).map(getLandingPrices)

    Ok(views.html.main(
      title,
      mainElement,
      Left(RefPath(js)),
      Left(RefPath("subscriptionsLandingPage.css")),
      description = stringsConfig.subscriptionsLandingDescription
    ){
      Html(
        s"""<script type="text/javascript">
              window.guardian.pricingCopy = ${outputJson(pricingCopy)}
            </script>""")
    }).withSettingsSurrogateKey
  }

}
