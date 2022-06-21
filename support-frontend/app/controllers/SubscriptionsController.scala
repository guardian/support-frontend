package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath}
import cats.data.OptionT
import com.gu.i18n.CountryGroup
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.GuardianWeekly.postIntroductorySixForSixBillingPeriod
import com.gu.support.catalog._
import com.gu.support.encoding.Codec.deriveCodec
import services.pricing.{PriceSummary, PriceSummaryServiceProvider}
import com.gu.support.promotions.DefaultPromotions
import com.gu.support.redemption.corporate.{DynamoLookup, DynamoTableAsync}
import com.gu.support.workers.{Annual, Monthly}
import config.StringsConfig
import lib.RedirectWithEncodedQueryString
import play.api.mvc._
import play.twirl.api.Html
import services.PropensityTable
import views.EmptyDiv
import views.ViewHelpers.outputJson

import scala.concurrent.{ExecutionContext, Future}

class SubscriptionsController(
  val actionRefiners: CustomActionBuilders,
  priceSummaryServiceProvider: PriceSummaryServiceProvider,
  val assets: AssetsResolver,
  components: ControllerComponents,
  stringsConfig: StringsConfig,
  settingsProvider: AllSettingsProvider,
  val supportUrl: String,
  propensityDynamoTable: DynamoTableAsync,
)(implicit val ec: ExecutionContext)
  extends AbstractController(components)
    with GeoRedirect
    with CanonicalLinks
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

  def pricingCopy(priceSummary: PriceSummary): PriceCopy =
    PriceCopy(
      priceSummary.price,
      priceSummary.promotions.headOption.map(_.description).getOrElse(""),
    )

  def getLandingPrices(countryGroup: CountryGroup): Map[String, PriceCopy] = {
    val service = priceSummaryServiceProvider.forUser(false)

    val paperMap = if (countryGroup == CountryGroup.UK) {
      val paper = service.getPrices(Paper, List(DefaultPromotions.Paper.june21Promotion))(CountryGroup.UK)(Collection)(
        Sunday,
      )(Monthly)(GBP)
      Map(Paper.toString -> pricingCopy(paper))
    } else
      Map.empty

    val guardianWeeklyFulfilmentOptions = if (countryGroup == CountryGroup.RestOfTheWorld) RestOfWorld else Domestic
    // The client currently only supports monthly
    val guardianWeeklyBillingPeriod = postIntroductorySixForSixBillingPeriod
    val weekly =
      service.getPrices(
        GuardianWeekly,
        Nil,
      )(countryGroup)(guardianWeeklyFulfilmentOptions)(NoProductOptions)(guardianWeeklyBillingPeriod)(
        countryGroup.currency,
      )

    val digitalSubscription = service
      .getPrices(
        DigitalPack,
        List(DefaultPromotions.DigitalSubscription.Monthly.fiftyPercentOff3Months),
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

    Ok(
      views.html.main(
        title,
        mainElement,
        Left(RefPath(js)),
        Left(RefPath("subscriptionsLandingPage.css")),
        description = stringsConfig.subscriptionsLandingDescription,
      ) {
        Html(s"""<script type="text/javascript">
              window.guardian.pricingCopy = ${outputJson(pricingCopy)}
            </script>""")
      },
    ).withSettingsSurrogateKey
  }

  def propensity(bwidOverride: Option[String]): Action[AnyContent] = PrivateAction.async { implicit request =>
    val bwidCookieValue = request.cookies.get("bwid").map(_.value)
    val maybeProductToSuggest = for {
      bwid <- OptionT.fromOption[Future](bwidOverride orElse bwidCookieValue)
      dynamoRecord <- OptionT(propensityDynamoTable.lookup(bwid))
      productDyamoValue <- OptionT.fromOption[Future](dynamoRecord.get(PropensityTable.ProductField.name))
      recommendedProduct <- OptionT.fromOption[Future](productDyamoValue match {
        case DynamoLookup.DynamoString(string) => Some(string)
        case _ => None
      }
      )
    } yield recommendedProduct
    val jsLine = maybeProductToSuggest.map { product =>
      s"""window.guardian.propensityProduct = "$product""""
    }.getOrElse("// no propensityProduct")
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | Get a Subscription"
    val mainElement = EmptyDiv("subscriptions-landing-page")
    val js = "subscriptionsLandingPage.js"
    val pricingCopy = CountryGroup.byId("uk").map(getLandingPrices)
    jsLine.map { jsLine =>
      Ok(
        views.html.main(
          title,
          mainElement,
          Left(RefPath(js)),
          Left(RefPath("subscriptionsLandingPage.css")),
          description = stringsConfig.subscriptionsLandingDescription,
        ) {
          Html(
            s"""<script type="text/javascript">
              window.guardian.pricingCopy = ${outputJson(pricingCopy)}
              $jsLine
            </script>"""
          )
        },
      ).withSettingsSurrogateKey
    }
  }

}
