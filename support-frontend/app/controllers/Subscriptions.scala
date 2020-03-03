package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.i18n.CountryGroup
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog._
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.pricing.{PriceSummary, PriceSummaryServiceProvider}
import com.gu.support.workers.{Monthly, Quarterly}
import config.StringsConfig
import lib.RedirectWithEncodedQueryString
import play.api.mvc._
import play.twirl.api.Html
import services.IdentityService
import views.EmptyDiv
import views.ViewHelpers.outputJson

import scala.concurrent.ExecutionContext

class Subscriptions(
    val actionRefiners: CustomActionBuilders,
    identityService: IdentityService,
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    val assets: AssetsResolver,
    components: ControllerComponents,
    stringsConfig: StringsConfig,
    settingsProvider: AllSettingsProvider,
    val supportUrl: String,
    fontLoaderBundle: Either[RefPath, StyleContent]
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

  def pricingCopy(priceSummary: PriceSummary): PriceCopy = {
    val discountCopy = for {
      promotion <- priceSummary.promotions.headOption
      discountedPrice <- promotion.discountedPrice
    } yield PriceCopy(discountedPrice, promotion.description)
    discountCopy.getOrElse(PriceCopy(priceSummary.price, ""))
  }

  def getLandingPrices(countryGroup: CountryGroup): Map[String, PriceCopy] = {
    val service = priceSummaryServiceProvider.forUser(false)

    val paperMap = if (countryGroup == CountryGroup.UK) {
      val paper = service.getPrices(Paper, List("GE19SUBS"))(CountryGroup.UK)(Collection)(Sunday)(Monthly)(GBP)
      Map(Paper.toString -> pricingCopy(paper))
    }
    else
      Map.empty

    val weekly = service.getPrices(GuardianWeekly, Nil)(countryGroup)(Domestic)(NoProductOptions)(Quarterly)(countryGroup.currency)

    val digitalSubscription = service
      .getPrices(DigitalPack, List("DK0NT24WG"))(countryGroup)(NoFulfilmentOptions)(NoProductOptions)(Monthly)(countryGroup.currency)

    Map(GuardianWeekly.toString -> pricingCopy(weekly), DigitalPack.toString -> pricingCopy(digitalSubscription)) ++ paperMap
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
      fontLoaderBundle,
      description = stringsConfig.subscriptionsLandingDescription
    ){
      Html(
        s"""<script type="text/javascript">
              window.guardian.pricingCopy = ${outputJson(pricingCopy)}
            </script>""")
    }).withSettingsSurrogateKey
  }

}
