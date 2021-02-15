package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax, SwitchState}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.implicits._
import com.gu.i18n.Country.UK
import com.gu.i18n.CountryGroup
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.catalog.DigitalPack
import com.gu.support.config.{PayPalConfigProvider, Stage, Stages, StripeConfigProvider}
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.pricing.PriceSummaryServiceProvider
import com.gu.support.promotions.{DefaultPromotions, PromoCode, ProductPromotionCopy, PromotionServiceProvider}
import config.{RecaptchaConfigProvider, StringsConfig}
import controllers.UserDigitalSubscription.{redirectToExistingThankYouPage, userHasDigitalSubscription}
import play.api.libs.circe.Circe
import play.api.mvc._
import play.twirl.api.Html
import services._
import views.EmptyDiv
import views.ViewHelpers._
import views.html.helper.CSRF
import views.html.subscriptionCheckout
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}

import scala.concurrent.{ExecutionContext, Future}

class DigitalSubscriptionController(
  priceSummaryServiceProvider: PriceSummaryServiceProvider,
  promotionServiceProvider: PromotionServiceProvider,
  val assets: AssetsResolver,
  val actionRefiners: CustomActionBuilders,
  identityService: IdentityService,
  testUsers: TestUserService,
  membersDataService: MembersDataService,
  stripeConfigProvider: StripeConfigProvider,
  payPalConfigProvider: PayPalConfigProvider,
  components: ControllerComponents,
  stringsConfig: StringsConfig,
  settingsProvider: AllSettingsProvider,
  val supportUrl: String,
  fontLoaderBundle: Either[RefPath, StyleContent],
  stage: Stage,
  recaptchaConfigProvider: RecaptchaConfigProvider
)(
  implicit val ec: ExecutionContext
) extends AbstractController(components) with GeoRedirect with CanonicalLinks with Circe with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def digital(countryCode: String, orderIsAGift: Boolean): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = s"Support the Guardian | The Guardian Digital ${if (orderIsAGift) "Gift " else ""}Subscription"
    val mainElement = EmptyDiv("digital-subscription-landing-page-" + countryCode)
    val js = Left(RefPath("digitalSubscriptionLandingPage.js"))
    val css = Left(RefPath("digitalSubscriptionLandingPage.css"))
    val description = stringsConfig.digitalPackLandingDescription
    val canonicalLink = Some(buildCanonicalDigitalSubscriptionLink("uk", orderIsAGift))
    val queryPromos = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
    val promoCodes: List[PromoCode] = queryPromos ++ DefaultPromotions.DigitalSubscription.all
    val hrefLangLinks = Map(
      "en-us" -> buildCanonicalDigitalSubscriptionLink("us", orderIsAGift),
      "en-gb" -> buildCanonicalDigitalSubscriptionLink("uk", orderIsAGift),
      "en-au" -> buildCanonicalDigitalSubscriptionLink("au", orderIsAGift),
      "en" -> buildCanonicalDigitalSubscriptionLink("int", orderIsAGift)
    )
    val country = (for {
      countryGroup <- CountryGroup.byId(countryCode)
      country <- countryGroup.countries.headOption
    } yield country).getOrElse(UK)
    val maybePromotionCopy = queryPromos.headOption.flatMap(promoCode =>
      ProductPromotionCopy(promotionServiceProvider
        .forUser(false), stage)
        .getCopyForPromoCode(promoCode, DigitalPack, country)
    )
    val readerType = if (orderIsAGift) Gift else Direct
    val productPrices = priceSummaryServiceProvider.forUser(false).getPrices(DigitalPack, promoCodes, readerType)
    val shareImageUrl = Some("https://i.guim.co.uk/img/media/74422ad120c709448f433c34f5190e2465ffa65e/0_0_1200_1200/1200.png?width=1200&auto=format&fit=crop&quality=85&s=1407add4d016d15cc074b0f9de8f1433") // scalastyle:ignore
    if (settings.switches.enableDigitalSubGifting.isOn || !orderIsAGift) {
      Ok(views.html.main(
        title = title,
        mainElement = mainElement,
        mainJsBundle = js,
        mainStyleBundle = css,
        fontLoaderBundle = fontLoaderBundle,
        description = description,
        canonicalLink = canonicalLink,
        hrefLangLinks = hrefLangLinks,
        shareImageUrl = shareImageUrl,
        shareUrl = canonicalLink
      ) {
        Html(s"""<script type="text/javascript">
          window.guardian.productPrices = ${outputJson(productPrices)}
          window.guardian.promotionCopy = ${outputJson(maybePromotionCopy)}
          window.guardian.orderIsAGift = $orderIsAGift
        </script>""")
      }).withSettingsSurrogateKey
    } else {
      Redirect(routes.DigitalSubscriptionController.digitalGeoRedirect(false)).withSettingsSurrogateKey
    }
  }

  def digitalGeoRedirect(orderIsAGift: Boolean = false): Action[AnyContent] = geoRedirect(
    if (orderIsAGift) "subscribe/digital/gift" else "subscribe/digital"
  )

  def displayForm(orderIsAGift: Boolean): Action[AnyContent] = {
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    if (settings.switches.enableDigitalSubGifting.isOn || !orderIsAGift) {
      authenticatedAction(subscriptionsClientId).async { implicit request =>

      identityService.getUser(request.user.minimalUser).fold(
        error => {
          SafeLogger.error(scrub"Failed to display digital subscriptions form for ${request.user.minimalUser.id} due to error from identityService: $error")
          Future.successful(InternalServerError)
        },
        user => {
          userHasDigitalSubscription(membersDataService, request.user) map {
            case true => if (orderIsAGift) Ok(digitalSubscriptionFormHtml(user, orderIsAGift)) else redirectToExistingThankYouPage
            case _ => Ok(digitalSubscriptionFormHtml(user, orderIsAGift))
          }
        }
      ).flatten.map(_.withSettingsSurrogateKey)
    }
    } else {
      Action(Redirect(routes.DigitalSubscriptionController.digitalGeoRedirect(false)).withSettingsSurrogateKey)
    }
  }


  private def digitalSubscriptionFormHtml(idUser: IdUser, orderIsAGift: Boolean)(implicit request: RequestHeader, settings: AllSettings): Html = {
    val title = if (orderIsAGift) {
      "Support the Guardian | The Guardian Digital Gift Subscription"
     } else {
       "Support the Guardian | The Guardian Digital Subscription"
     }
    val id = EmptyDiv("digital-subscription-checkout-page")
    val js = "digitalSubscriptionCheckoutPage.js"
    val css = "digitalSubscriptionCheckoutPage.css"
    val csrf = CSRF.getToken.value
    val uatMode = testUsers.isTestUser(idUser.publicFields.displayName)
    val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
    val v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(uatMode).v2PublicKey
    val readerType = if (orderIsAGift) Gift else Direct

    subscriptionCheckout(
      title,
      id,
      js,
      css,
      fontLoaderBundle,
      Some(csrf),
      idUser,
      uatMode,
      priceSummaryServiceProvider.forUser(uatMode).getPrices(DigitalPack, promoCodes, readerType),
      stripeConfigProvider.get(),
      stripeConfigProvider.get(true),
      payPalConfigProvider.get(),
      payPalConfigProvider.get(true),
      v2recaptchaConfigPublicKey,
      orderIsAGift
    )
  }

  def displayThankYouExisting(): Action[AnyContent] = CachedAction() { implicit request =>

    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | The Guardian Digital Subscription"
    val mainElement = EmptyDiv("digital-subscription-checkout-page")
    val js = Left(RefPath("digitalSubscriptionCheckoutPageThankYouExisting.js"))
    val css = Left(RefPath("digitalSubscriptionCheckoutPageThankYouExisting.css"))

    Ok(views.html.main(
      title,
      mainElement,
      js,
      css,
      fontLoaderBundle
    )())
  }

}
