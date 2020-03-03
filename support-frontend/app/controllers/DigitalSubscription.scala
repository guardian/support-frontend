package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.implicits._
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.catalog.DigitalPack
import com.gu.support.config.{PayPalConfigProvider, Stage, Stages, StripeConfigProvider}
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.pricing.PriceSummaryServiceProvider
import config.StringsConfig
import play.api.libs.circe.Circe
import play.api.mvc._
import play.twirl.api.Html
import services._
import views.EmptyDiv
import views.ViewHelpers._
import views.html.helper.CSRF
import views.html.subscriptionCheckout

import scala.concurrent.{ExecutionContext, Future}

class DigitalSubscription(
  priceSummaryServiceProvider: PriceSummaryServiceProvider,
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
  stripeSetupIntentEndpoint: String
)(
  implicit val ec: ExecutionContext
) extends AbstractController(components) with GeoRedirect with CanonicalLinks with Circe with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def digital(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | The Guardian Digital Subscription"
    val mainElement = EmptyDiv("digital-subscription-landing-page-" + countryCode)
    val js = Left(RefPath("digitalSubscriptionLandingPage.js"))
    val css = Left(RefPath("digitalSubscriptionLandingPage.css"))
    val description = stringsConfig.digitalPackLandingDescription
    val canonicalLink = Some(buildCanonicalDigitalSubscriptionLink("uk"))
    val september2019SalePromo = "DK0NT24WG"
    val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil) :+ september2019SalePromo
    val hrefLangLinks = Map(
      "en-us" -> buildCanonicalDigitalSubscriptionLink("us"),
      "en-gb" -> buildCanonicalDigitalSubscriptionLink("uk"),
      "en-au" -> buildCanonicalDigitalSubscriptionLink("au"),
      "en" -> buildCanonicalDigitalSubscriptionLink("int")
    )
    val productPrices = priceSummaryServiceProvider.forUser(false).getPrices(DigitalPack, promoCodes)
    val shareImageUrl = Some("https://i.guim.co.uk/img/media/1033800a75851058d619bc0519b0b7b48a53dcf5/0_0_1200_1200/1200.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=0d50dd49d1fedeacff8a3e437332c2bf") // scalastyle:ignore

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
      Html(s"""<script type="text/javascript">window.guardian.productPrices = ${outputJson(productPrices)}</script>""")
    }).withSettingsSurrogateKey
  }

  def digitalGeoRedirect: Action[AnyContent] = geoRedirect("subscribe/digital")

  private def userHasDigipack(user: AuthenticatedIdUser): Future[Boolean] = {
    user.credentials match {
      case cookies: AccessCredentials.Cookies =>
        membersDataService.userAttributes(cookies).value map {
          case Left(_) => false
          case Right(response: MembersDataService.UserAttributes) => response.contentAccess.digitalPack
        }
      case _ => Future.successful(false)
    }
  }

  def displayForm(): Action[AnyContent] =
    authenticatedAction(subscriptionsClientId).async { implicit request =>
      implicit val settings: AllSettings = settingsProvider.getAllSettings()
      identityService.getUser(request.user.minimalUser).fold(
        error => {
          SafeLogger.error(scrub"Failed to display digital subscriptions form for ${request.user.minimalUser.id} due to error from identityService: $error")
          Future.successful(InternalServerError)
        },
        user => {
          userHasDigipack(request.user) map {
            case true => Redirect(routes.DigitalSubscription.displayThankYouExisting().url, request.queryString, status = FOUND)
            case _ => Ok(digitalSubscriptionFormHtml(user))
          }
        }
      ).flatten.map(_.withSettingsSurrogateKey)
    }

  private def digitalSubscriptionFormHtml(idUser: IdUser)(implicit request: RequestHeader, settings: AllSettings): Html = {
    val title = "Support the Guardian | The Guardian Digital Subscription"
    val id = EmptyDiv("digital-subscription-checkout-page")
    val js = "digitalSubscriptionCheckoutPage.js"
    val css = "digitalSubscriptionCheckoutPage.css"
    val csrf = CSRF.getToken.value
    val uatMode = testUsers.isTestUser(idUser.publicFields.displayName)
    val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)

    subscriptionCheckout(
      title,
      id,
      js,
      css,
      fontLoaderBundle,
      Some(csrf),
      idUser,
      uatMode,
      priceSummaryServiceProvider.forUser(uatMode).getPrices(DigitalPack, promoCodes),
      stripeConfigProvider.get(),
      stripeConfigProvider.get(true),
      payPalConfigProvider.get(),
      payPalConfigProvider.get(true),
      stripeSetupIntentEndpoint
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
