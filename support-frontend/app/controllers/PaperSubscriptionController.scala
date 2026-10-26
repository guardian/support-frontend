package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.i18n.Country.UK
import com.gu.i18n.CountryGroup
import com.gu.support.catalog.Paper
import com.gu.support.config.Stage
import com.gu.support.config.Stages.PROD
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.{CatalogRatePlan, PromoWithCatalogInformation}
import services.{ApplicablePromotions, CachedProductCatalogServiceProvider, CachedPromotionsServiceProvider}
import services.pricing.DefaultPromotionService
import config.StringsConfig
import play.api.mvc._
import play.twirl.api.Html
import views.EmptyDiv
import views.ViewHelpers.outputJson

import scala.concurrent.ExecutionContext

class PaperSubscriptionController(
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

  def paper(): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val canonicalLink = Some(s"${supportUrl}/uk/subscribe/paper")
    val defaultPromos = defaultPromotionService.getPromoCodes(Paper)
    val queryPromos = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
    val promotions = getPromotions(queryPromos ++ defaultPromos)
    val productCatalog = cachedProductCatalogServiceProvider.fromStage(stage, isTestUser = false).get()

    Ok(
      views.html.main(
        title = "The Guardian Newspaper Subscription | Subscription Card and Home Delivery",
        mainElement = EmptyDiv("paper-subscription-landing-page"),
        mainJsBundle = RefPath("paperSubscriptionLandingPage.js"),
        mainStyleBundle = None,
        description = stringsConfig.paperLandingDescription,
        canonicalLink = canonicalLink,
        shareImageUrl = Some(
          "https://i.guim.co.uk/img/media/0a1ffb0ec7e4dbbab40421b74e4bcf5d628f4708/0_0_1200_1200/1200.jpg" +
            "?width=1200&height=1200&quality=85&auto=format&fit=crop&s=c6c7f5b373a1ae54bc66c876a9a60031",
        ),
        shareUrl = canonicalLink,
        noindex = stage != PROD,
      ) {
        Html(
          s"""<script type="text/javascript">
      window.guardian.promotions = ${outputJson(promotions)}
      window.guardian.productCatalog = ${outputJson(productCatalog, dropNullValues = false)}
      </script>""",
        )
      },
    ).withSettingsSurrogateKey
  }

  private def getPromotions(promoCodes: List[String]): Seq[PromoWithCatalogInformation] = {
    val promotions = cachedPromotionsServiceProvider.forUser(isTestUser = false).getActive(promoCodes.distinct)
    ApplicablePromotions.filter(promotions, CatalogRatePlan.paperProductKeys, isGift = false, CountryGroup.UK)
  }

}
