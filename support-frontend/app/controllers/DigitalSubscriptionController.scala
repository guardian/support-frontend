package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.support.catalog.DigitalPack
import com.gu.support.config.PayPalConfigProvider
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.pricing.{PriceSummaryServiceProvider, ProductPrices}
import com.gu.support.promotions._
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import config.StringsConfig
import play.api.mvc._
import play.twirl.api.Html
import views.EmptyDiv
import views.ViewHelpers._
import views.html.helper.CSRF

import scala.concurrent.ExecutionContext

class DigitalSubscriptionController(
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    landingCopyProvider: LandingCopyProvider,
    val assets: AssetsResolver,
    val actionRefiners: CustomActionBuilders,
    payPalConfigProvider: PayPalConfigProvider,
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

  def digitalGeoRedirect(orderIsAGift: Boolean = false): Action[AnyContent] = geoRedirect(
    if (orderIsAGift) "subscribe/digital/gift" else "subscribe/digital",
  )

  def digital(countryCode: String, orderIsAGift: Boolean): Action[AnyContent] = {
    MaybeAuthenticatedAction { implicit request =>
      implicit val settings: AllSettings = settingsProvider.getAllSettings()

      if (!settings.switches.subscriptionsSwitches.enableDigitalSubGifting.isOn && orderIsAGift) {
        Redirect(routes.DigitalSubscriptionController.digitalGeoRedirect(false)).withSettingsSurrogateKey
      } else {
        val canonicalLink = Some(buildCanonicalDigitalSubscriptionLink("uk", orderIsAGift))
        val queryPromos = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
        Ok(
          views.html.main(
            title = s"Support the Guardian | The Guardian Digital ${if (orderIsAGift) "Gift " else ""}Subscription",
            mainElement = EmptyDiv("digital-subscription-landing-page-" + countryCode),
            mainJsBundle = Left(RefPath("digitalSubscriptionLandingPage.js")),
            mainStyleBundle = Left(RefPath("digitalSubscriptionLandingPage.css")),
            description = stringsConfig.digitalPackLandingDescription,
            canonicalLink = canonicalLink,
            hrefLangLinks = getPaperHrefLangLinks(orderIsAGift),
            shareImageUrl = Some(
              "https://i.guim.co.uk/img/media/74422ad120c709448f433c34f5190e2465ffa65e/0_0_1200_1200/1200.png" +
                "?width=1200&auto=format&fit=crop&quality=85&s=1407add4d016d15cc074b0f9de8f1433",
            ),
            shareUrl = canonicalLink,
            csrf = Some(CSRF.getToken.value),
          ) {
            val maybePromotionCopy = landingCopyProvider.promotionCopy(queryPromos, DigitalPack, countryCode)
            Html(
              s"""<script type="text/javascript">
          window.guardian.productPrices = ${outputJson(productPrices(queryPromos, orderIsAGift))}
          window.guardian.promotionCopy = ${outputJson(maybePromotionCopy)}
          window.guardian.orderIsAGift = $orderIsAGift
          window.guardian.payPalEnvironment = {
            default: "${payPalConfigProvider.get().payPalEnvironment}",
            uat: "${payPalConfigProvider.get(true).payPalEnvironment}"
          };
        </script>""",
            )
          },
        ).withSettingsSurrogateKey
      }
    }
  }

  private def getPaperHrefLangLinks(orderIsAGift: Boolean): Map[String, String] = {
    Map(
      "en-us" -> buildCanonicalDigitalSubscriptionLink("us", orderIsAGift),
      "en-gb" -> buildCanonicalDigitalSubscriptionLink("uk", orderIsAGift),
      "en-au" -> buildCanonicalDigitalSubscriptionLink("au", orderIsAGift),
      "en" -> buildCanonicalDigitalSubscriptionLink("int", orderIsAGift),
    )
  }

  def productPrices(queryPromos: List[String], orderIsAGift: Boolean): ProductPrices = {
    val promoCodes: List[PromoCode] = queryPromos ++ DefaultPromotions.DigitalSubscription.all
    val readerType = if (orderIsAGift) Gift else Direct
    priceSummaryServiceProvider.forUser(false).getPrices(DigitalPack, promoCodes, readerType)
  }

}
