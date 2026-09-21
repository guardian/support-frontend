package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.CatalogRatePlan
import lib.RedirectWithEncodedQueryString
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import play.twirl.api.Html
import services.{CachedPromotionsServiceProvider, TestUserService}
import views.EmptyDiv
import views.ViewHelpers.outputJson
import admin.ServersideAbTest.Participation

import scala.concurrent.ExecutionContext
import scala.util.control.NonFatal

class Promotions(
    cachedPromotionsServiceProvider: CachedPromotionsServiceProvider,
    val assets: AssetsResolver,
    val actionRefiners: CustomActionBuilders,
    testUsers: TestUserService, // Remove?
    components: ControllerComponents,
    settingsProvider: AllSettingsProvider,
) extends AbstractController(components) {
  import actionRefiners._

  implicit val a: AssetsResolver = assets
  implicit val ec: ExecutionContext = components.executionContext

  def promo(promoCode: String): Action[AnyContent] = CachedAction().async { implicit request =>
    cachedPromotionsServiceProvider
      .forUser(isTestUser = false)
      .get(promoCode)
      .map {
        case None => NotFound("Invalid promo code")
        case Some(promotion) =>
          val productLandingPage = Promotions.redirectPathForCatalogRatePlans(promotion.appliesTo.catalogRatePlans)
          val queryString = request.queryString + ("promoCode" -> Seq(promoCode))

          RedirectWithEncodedQueryString(productLandingPage, queryString, MOVED_PERMANENTLY)
      }
      .recover { case NonFatal(_) =>
        InternalServerError("Failed to fetch promotion")
      }
  }

  def terms(promoCode: String): Action[AnyContent] = CachedAction().async { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | Digital Pack Subscription"
    val mainElement = EmptyDiv("promotion-terms")
    val js = RefPath("promotionTerms.js")

    // Promotion sourced from promotions-api via CachedPromotionsService - see guardian/support-frontend#8207.
    // This is now the sole source of truth for this page - the legacy productPrices/promotionTerms models
    // (derived from Zuora-catalog-embedded promotions) are no longer injected here.
    cachedPromotionsServiceProvider
      .forUser(isTestUser = false)
      .get(promoCode)
      .map {
        case None => NotFound("Invalid promo code")
        case Some(promotion) =>
          Ok(
            views.html.main(
              title,
              mainElement,
              js,
              None,
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
                window.guardian.promotions = ${outputJson(Seq(promotion))}
              </script>""")
            },
          )
      }
      .recover { case NonFatal(_) =>
        InternalServerError("Failed to fetch promotion")
      }
  }

}

object Promotions {

  // Product-catalog keys (see support-frontend/assets/helpers/productCatalog.ts) for the Guardian Weekly and Paper
  // products/rate plans - anything not matched by these (or DigitalSubscription) falls back to the contribution
  // redirect, matching the previous legacy-Product-based behaviour's catch-all case.
  private val guardianWeeklyProductKeys = Set(
    "GuardianWeeklyDomestic",
    "GuardianWeeklyRestOfWorld",
    "GuardianWeeklyZoneA",
    "GuardianWeeklyZoneB",
    "GuardianWeeklyZoneC",
  )
  private val paperProductKeys = Set("HomeDelivery", "NationalDelivery", "NewspaperVoucher", "SubscriptionCard")

  /** Maps the catalog rate plans a promotion applies to onto the redirect path for its product's landing page.
    *
    * Mirrors the client-side `productForCatalogKey` mapping in assets/pages/promotion-terms/promotionTerms.tsx, but
    * works directly off the promotions-api's catalog product/rate-plan keys and returns the redirect URL itself, rather
    * than going via the legacy `Product` domain type - see guardian/support-frontend#8207.
    */
  def redirectPathForCatalogRatePlans(catalogRatePlans: List[CatalogRatePlan]): String = {
    val productKeys = catalogRatePlans.map(_.productKey).toSet
    val isGift = catalogRatePlans.nonEmpty && catalogRatePlans.forall(_.productRatePlanKey.contains("Gift"))

    if (productKeys.contains("DigitalSubscription")) {
      routes.Application.geoRedirectToPath("subscribe/digitaledition").url
    } else if (productKeys.exists(guardianWeeklyProductKeys.contains)) {
      routes.WeeklySubscriptionController.weeklyGeoRedirect(isGift).url
    } else if (productKeys.exists(paperProductKeys.contains)) {
      routes.PaperSubscriptionController.paper().url
    } else {
      routes.Application.contributeGeoRedirect("").url
    }
  }
}
