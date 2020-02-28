package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.implicits._
import com.gu.googleauth.AuthAction
import com.gu.i18n.Country.UK
import com.gu.i18n.CountryGroup
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.config.{PayPalConfigProvider, Stage, StripeConfigProvider}
import com.gu.support.pricing.PriceSummaryServiceProvider
import com.gu.support.promotions.{ProductPromotionCopy, PromotionServiceProvider}
import config.StringsConfig
import play.api.libs.circe.Circe
import play.api.mvc._
import play.twirl.api.Html
import services.{IdentityService, TestUserService}
import views.EmptyDiv
import views.ViewHelpers.outputJson
import views.html.helper.CSRF
import views.html.subscriptionCheckout

import scala.concurrent.{ExecutionContext, Future}

class WeeklySubscription(
  authAction: AuthAction[AnyContent],
  priceSummaryServiceProvider: PriceSummaryServiceProvider,
  promotionServiceProvider: PromotionServiceProvider,
  val assets: AssetsResolver,
  val actionRefiners: CustomActionBuilders,
  identityService: IdentityService,
  testUsers: TestUserService,
  stripeConfigProvider: StripeConfigProvider,
  payPalConfigProvider: PayPalConfigProvider,
  components: ControllerComponents,
  stringsConfig: StringsConfig,
  settingsProvider: AllSettingsProvider,
  val supportUrl: String,
  fontLoaderBundle: Either[RefPath, StyleContent],
  stripeSetupIntentEndpoint: String,
  stage: Stage
)(implicit val ec: ExecutionContext) extends AbstractController(components) with GeoRedirect with Circe with CanonicalLinks with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  val weeklyHrefLangLinks: Map[String, String] =
    Map(
      "en-us" -> buildCanonicalWeeklySubscriptionLink("us"),
      "en-gb" -> buildCanonicalWeeklySubscriptionLink("uk"),
      "en-au" -> buildCanonicalWeeklySubscriptionLink("au"),
      "en-nz" -> buildCanonicalWeeklySubscriptionLink("nz"),
      "en-ca" -> buildCanonicalWeeklySubscriptionLink("ca"),
      "en" -> buildCanonicalWeeklySubscriptionLink("int"),
      "en" -> buildCanonicalWeeklySubscriptionLink("eu")
    )

  def weeklyGeoRedirect(orderIsAGift: Boolean = false): Action[AnyContent] = geoRedirect(
    if (orderIsAGift) "subscribe/weekly/gift" else "subscribe/weekly"
  )

  def weekly(countryCode: String, orderIsAGift: Boolean): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = if (orderIsAGift) "The Guardian Weekly Gift Subscription | The Guardian" else "The Guardian Weekly Subscriptions | The Guardian"
    val mainElement = EmptyDiv("weekly-landing-page-" + countryCode)
    val js = Left(RefPath("weeklySubscriptionLandingPage.js"))
    val css = Left(RefPath("weeklySubscriptionLandingPage.css"))
    val description = stringsConfig.weeklyLandingDescription
    val canonicalLink = Some(buildCanonicalWeeklySubscriptionLink("uk"))
    val defaultPromos = if (orderIsAGift) List("GW20GIFT1Y") else List(GuardianWeekly.AnnualPromoCode, GuardianWeekly.SixForSixPromoCode)
    val queryPromos = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
    val promoCodes = defaultPromos ++ queryPromos
    val productPrices = priceSummaryServiceProvider.forUser(false).getPrices(GuardianWeekly, promoCodes, orderIsAGift)
    // To see if there is any promotional copy in place for this page we need to get a country in the current region (country group)
    // this is because promotions apply to countries not regions. We can use any country however because the promo tool UI only deals
    // with regions and then adds all the countries for that region to the promotion
    val country = (for {
      countryGroup <- CountryGroup.byId(countryCode)
      country <- countryGroup.countries.headOption
    } yield country).getOrElse(UK)

    val maybePromotionCopy = queryPromos.headOption.flatMap(promoCode =>
      ProductPromotionCopy(promotionServiceProvider
        .forUser(false), stage)
        .getCopyForPromoCode(promoCode, GuardianWeekly, country)
    )
    val shareImageUrl = Some("https://i.guim.co.uk/img/media/00cb294c1f1e5140c63008d7a55b105ef2a786e6/0_0_1200_1200/1200.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=0034a6a7408ca4d162620f2c8b6bf2b9") // scalastyle:ignore

    Ok(views.html.main(
      title = title,
      mainElement = mainElement,
      mainJsBundle = js,
      mainStyleBundle = css,
      fontLoaderBundle = fontLoaderBundle,
      description = description,
      canonicalLink = canonicalLink,
      hrefLangLinks = weeklyHrefLangLinks,
      shareImageUrl = shareImageUrl,
      shareUrl = canonicalLink
    ){
      Html(
        s"""<script type="text/javascript">
              window.guardian.productPrices = ${outputJson(productPrices)}
              window.guardian.promotionCopy = ${outputJson(maybePromotionCopy)}
              window.guardian.orderIsAGift = $orderIsAGift
            </script>""")
    }).withSettingsSurrogateKey
  }

  def displayForm(orderIsAGift: Boolean): Action[AnyContent] = authenticatedAction(subscriptionsClientId).async { implicit request =>
      implicit val settings: AllSettings = settingsProvider.getAllSettings()
      identityService.getUser(request.user.minimalUser).fold(
        error => {
          SafeLogger.error(
            scrub"Failed to display Guardian Weekly subscriptions form for ${request.user.minimalUser.id} due to error from identityService: $error"
          )
          Future.successful(InternalServerError)
        },
        user => {
          Future.successful(Ok(paperSubscriptionFormHtml(user, orderIsAGift)))
        }
      ).flatten.map(_.withSettingsSurrogateKey)
    }

  private def paperSubscriptionFormHtml(idUser: IdUser, orderIsAGift: Boolean)(implicit request: RequestHeader, settings: AllSettings): Html = {
    val title = "Support the Guardian | Guardian Weekly Subscription"
    val id = EmptyDiv("weekly-subscription-checkout-page")
    val js = "weeklySubscriptionCheckoutPage.js"
    val css = "weeklySubscriptionCheckoutPage.css"
    val csrf = CSRF.getToken.value
    val uatMode = testUsers.isTestUser(idUser.publicFields.displayName)
    val defaultPromos = if (orderIsAGift) List("GW20GIFT1Y") else List(GuardianWeekly.AnnualPromoCode, GuardianWeekly.SixForSixPromoCode)
    val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil) ++ defaultPromos

    subscriptionCheckout(
      title,
      id,
      js,
      css,
      fontLoaderBundle,
      Some(csrf),
      idUser,
      uatMode,
      priceSummaryServiceProvider.forUser(uatMode).getPrices(GuardianWeekly, promoCodes, orderIsAGift),
      stripeConfigProvider.get(),
      stripeConfigProvider.get(true),
      payPalConfigProvider.get(),
      payPalConfigProvider.get(true),
      stripeSetupIntentEndpoint,
      orderIsAGift
    )
  }


}
