package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.implicits._
import com.gu.identity.play.{AccessCredentials, AuthenticatedIdUser, IdUser}
import com.gu.support.catalog.DigitalPack
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.pricing.PriceSummaryServiceProvider
import config.StringsConfig
import io.circe.syntax._
import lib.PlayImplicits._
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import play.api.libs.circe.Circe
import play.api.mvc.{request, _}
import play.twirl.api.Html
import services.{IdentityService, MembersDataService, TestUserService}
import views.html.subscriptionCheckout
import views.html.helper.CSRF
import views.ViewHelpers._
import com.gu.support.encoding.CustomCodecs._
import views.EmptyDiv

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
    fontLoaderBundle: Either[RefPath, StyleContent])
(implicit val ec: ExecutionContext) extends AbstractController(components) with GeoRedirect with CanonicalLinks with Circe with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def digital(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | Digital Pack Subscription"
    val mainElement = EmptyDiv("digital-subscription-landing-page-" + countryCode)
    val js = Left(RefPath("digitalSubscriptionLandingPage.js"))
    val css = Left(RefPath("digitalSubscriptionLandingPage.css"))
    val description = stringsConfig.digitalPackLandingDescription
    val canonicalLink = Some(buildCanonicalDigitalSubscriptionLink("uk"))
    val promoCode = request.queryString.get("promoCode").flatMap(_.headOption)
    val hrefLangLinks = Map(
      "en-us" -> buildCanonicalDigitalSubscriptionLink("us"),
      "en-gb" -> buildCanonicalDigitalSubscriptionLink("uk"),
      "en-au" -> buildCanonicalDigitalSubscriptionLink("au"),
      "en" -> buildCanonicalDigitalSubscriptionLink("int")
    )
    val productPrices = priceSummaryServiceProvider.forUser(false).getPrices(DigitalPack, promoCode)

    Ok(views.html.main(
      title, mainElement, js, css, fontLoaderBundle, description, canonicalLink, hrefLangLinks
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
      identityService.getUser(request.user).fold(
        error => {
          SafeLogger.error(scrub"Failed to display digital subscriptions form for ${request.user.id} due to error from identityService: $error")
          Future.successful(InternalServerError)
        },
        user => {
          userHasDigipack(request.user) map {
            case true =>  Redirect(routes.DigitalSubscription.displayThankYouExisting().url, request.queryString, status = FOUND)
            case _ => Ok(digitalSubscriptionFormHtml(user))
          }
        }
      ).flatten.map(_.withSettingsSurrogateKey)
    }

  private def digitalSubscriptionFormHtml(idUser: IdUser)(implicit request: RequestHeader, settings: AllSettings): Html = {
    val title = "Support the Guardian | Digital Subscription"
    val id = EmptyDiv("digital-subscription-checkout-page")
    val js = "digitalSubscriptionCheckoutPage.js"
    val css = "digitalSubscriptionCheckoutPage.css"
    val csrf = CSRF.getToken.value
    val uatMode = testUsers.isTestUser(idUser.publicFields.displayName)
    val promoCode = request.queryString.get("promoCode").flatMap(_.headOption)

    subscriptionCheckout(
      title,
      id,
      js,
      css,
      fontLoaderBundle,
      Some(csrf),
      idUser,
      uatMode,
      priceSummaryServiceProvider.forUser(uatMode).getPrices(DigitalPack, promoCode),
      stripeConfigProvider.get(false),
      stripeConfigProvider.get(true),
      payPalConfigProvider.get(false),
      payPalConfigProvider.get(true)
    )
  }

  def displayThankYouExisting(): Action[AnyContent] = CachedAction() { implicit request =>

    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | Digital Subscription"
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
