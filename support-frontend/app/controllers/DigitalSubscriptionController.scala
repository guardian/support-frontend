package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.support.catalog.DigitalPack
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.encoding.CustomCodecs._
import services.pricing.{PriceSummaryServiceProvider, ProductPrices}
import com.gu.i18n.Currency.{AUD}
import com.gu.support.promotions._
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import config.RecaptchaConfigProvider
import services._
import play.api.mvc._
import play.twirl.api.Html
import views.EmptyDiv
import views.ViewHelpers._
import views.html.helper.CSRF

import scala.concurrent.ExecutionContext

class DigitalSubscriptionController(
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    val assets: AssetsResolver,
    val actionRefiners: CustomActionBuilders,
    testUsers: TestUserService,
    stripeConfigProvider: StripeConfigProvider,
    payPalConfigProvider: PayPalConfigProvider,
    components: ControllerComponents,
    settingsProvider: AllSettingsProvider,
    recaptchaConfigProvider: RecaptchaConfigProvider,
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

  def kindleGeoRedirectWithPromoCode(): Action[AnyContent] = geoRedirect("kindle?promoCode=DLESNCWON")

  def digital(countryCode: String, orderIsAGift: Boolean): Action[AnyContent] = {
    MaybeAuthenticatedAction { implicit request =>
      implicit val settings: AllSettings = settingsProvider.getAllSettings()

      if (!settings.switches.subscriptionsSwitches.enableDigitalSubGifting.isOn && orderIsAGift) {
        Redirect(routes.DigitalSubscriptionController.digitalGeoRedirect(false)).withSettingsSurrogateKey
      } else {
        val title = if (orderIsAGift) {
          "Support the Guardian | The Guardian Digital Gift Subscription"
        } else {
          "Support the Guardian | The Guardian Digital Subscription"
        }
        val id = EmptyDiv("digital-subscription-checkout-page-" + countryCode)
        val js = "kindleSubscriptionLandingPage.js"
        val css = "kindleSubscriptionLandingPage.css"
        val csrf = CSRF.getToken.value

        val testMode = testUsers.isTestUser(request)
        val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
        val v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(testMode).v2PublicKey
        val readerType = if (orderIsAGift) Gift else Direct

        Ok(
          views.html.subscriptionCheckout(
            title,
            id,
            js,
            css,
            Some(csrf),
            request.user,
            testMode,
            priceSummaryServiceProvider.forUser(testMode).getPrices(DigitalPack, promoCodes, readerType),
            stripeConfigProvider.get(),
            stripeConfigProvider.get(true),
            payPalConfigProvider.get(),
            payPalConfigProvider.get(true),
            v2recaptchaConfigPublicKey,
            orderIsAGift,
          ),
        )
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
