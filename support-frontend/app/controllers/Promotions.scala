package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.support.catalog.{Contribution, DigitalPack, GuardianWeekly, Paper, SupporterPlus}
import com.gu.support.config.Stage
import com.gu.support.encoding.CustomCodecs._
import services.pricing.PriceSummaryServiceProvider
import com.gu.support.promotions.{PromoCode, PromotionServiceProvider, PromotionTerms}
import lib.RedirectWithEncodedQueryString
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import play.twirl.api.Html
import services.TestUserService
import views.EmptyDiv
import views.ViewHelpers.outputJson
import admin.ServersideAbTest.Participation

class Promotions(
    promotionServiceProvider: PromotionServiceProvider,
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    val assets: AssetsResolver,
    val actionRefiners: CustomActionBuilders,
    testUsers: TestUserService, // Remove?
    components: ControllerComponents,
    settingsProvider: AllSettingsProvider,
    stage: Stage,
) extends AbstractController(components) {
  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def promo(promoCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    val promotionService = promotionServiceProvider.forUser(false)
    val maybePromotionTerms = PromotionTerms.fromPromoCode(promotionService, stage, promoCode)

    maybePromotionTerms.fold(NotFound("Invalid promo code")) { promotionTerms =>
      val productLandingPage = promotionTerms.product match {
        case GuardianWeekly => routes.WeeklySubscriptionController.weeklyGeoRedirect(promotionTerms.isGift).url
        case DigitalPack => routes.DigitalSubscriptionController.digitalGeoRedirect().url
        case Paper => routes.PaperSubscriptionController.paper().url
        case _ => routes.Application.contributeGeoRedirect("").url
      }
      val queryString = {
        if (promoCode == "WINTERSAMPLER") {
          request.queryString + ("promoCode" -> Seq("WINTERSAMPLER", "WINTERSAMPLER2"))
        } else if (promoCode == "AUTUMN20") {
          request.queryString + ("promoCode" -> Seq("AUTUMN20", "AUTUMN30"))
        } else {
          request.queryString + ("promoCode" -> Seq(promoCode))
        }
      }
      RedirectWithEncodedQueryString(productLandingPage, queryString, MOVED_PERMANENTLY)
    }
  }

  def terms(promoCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | Digital Pack Subscription"
    val mainElement = EmptyDiv("promotion-terms")
    val js = RefPath("promotionTerms.js")
    val css = Some(RefPath("promotionTerms.css"))
    val promotionService = promotionServiceProvider.forUser(false)
    val maybePromotionTerms = PromotionTerms.fromPromoCode(promotionService, stage, promoCode)

    maybePromotionTerms.fold(NotFound("Invalid promo code")) { promotionTerms =>
      val productPrices =
        priceSummaryServiceProvider.forUser(false).getPrices(promotionTerms.product, List.empty[PromoCode])

      Ok(
        views.html.main(
          title,
          mainElement,
          js,
          css,
          description = None,
          canonicalLink = None,
          hrefLangLinks = Map(),
          csrf = None,
          shareImageUrl = None,
          shareUrl = None,
          serversideTests = Map(),
          noindex = true,
        ) {
          Html(s"""<script type="text/javascript">
                window.guardian.productPrices = ${outputJson(productPrices)}
                window.guardian.promotionTerms = ${outputJson(promotionTerms)}
              </script>""")
        },
      )
    }
  }

}
