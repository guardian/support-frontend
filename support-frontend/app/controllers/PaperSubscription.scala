package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.identity.model.{User => IdUser}
import com.gu.support.catalog.Paper
import com.gu.support.config.{PayPalConfigProvider, Stage, Stages, StripeConfigProvider}
import com.gu.support.pricing.PriceSummaryServiceProvider
import com.gu.tip.Tip
import config.Configuration.GuardianDomain
import config.StringsConfig
import play.api.mvc._
import play.twirl.api.Html
import services.stepfunctions.SupportWorkersClient
import services.{IdentityService, MembersDataService, TestUserService}
import views.html.subscriptionCheckout
import views.html.helper.CSRF
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import cats.data.EitherT
import cats.implicits._
import play.api.libs.circe.Circe
import views.EmptyDiv
import com.gu.support.encoding.CustomCodecs._
import views.ViewHelpers.outputJson

import scala.concurrent.{ExecutionContext, Future}

class PaperSubscription(
  priceSummaryServiceProvider: PriceSummaryServiceProvider,
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
  stripeSetupIntentEndpoint: String
)(implicit val ec: ExecutionContext) extends AbstractController(components) with GeoRedirect with Circe with CanonicalLinks with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def paperMethodRedirect(withDelivery: Boolean = false): Action[AnyContent] = Action { implicit request =>
    Redirect(buildCanonicalPaperSubscriptionLink(withDelivery), request.queryString, status = FOUND)
  }

  def paper(withDelivery: Boolean = false): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "The Guardian Newspaper Subscription | Vouchers and Delivery"
    val mainElement = assets.getSsrCacheContentsAsHtml("paper-subscription-landing-page","paper-subscription-landing.html")
    val js = Left(RefPath("paperSubscriptionLandingPage.js"))
    val css = Left(RefPath("paperSubscriptionLandingPage.css"))
    val canonicalLink = Some(buildCanonicalPaperSubscriptionLink())
    val description = stringsConfig.paperLandingDescription
    val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil) :+ "SEP2512VHD"
    val productPrices = priceSummaryServiceProvider.forUser(false).getPrices(Paper, promoCodes)

    Ok(views.html.main(title, mainElement, js, css, fontLoaderBundle, description, canonicalLink){
      Html(s"""<script type="text/javascript">window.guardian.productPrices = ${outputJson(productPrices)}</script>""")
    }).withSettingsSurrogateKey
  }

  def displayForm(): Action[AnyContent] =
    authenticatedAction(subscriptionsClientId).async { implicit request =>
      implicit val settings: AllSettings = settingsProvider.getAllSettings()
      identityService.getUser(request.user.minimalUser).fold(
        error => {
          SafeLogger.error(scrub"Failed to display paper subscriptions form for ${request.user.minimalUser.id} due to error from identityService: $error")
          Future.successful(InternalServerError)
        },
        user => {
          Future.successful(Ok(paperSubscriptionFormHtml(user)))
        }
      ).flatten.map(_.withSettingsSurrogateKey)
    }

  private def paperSubscriptionFormHtml(idUser: IdUser)(implicit request: RequestHeader, settings: AllSettings): Html = {
    val title = "Support the Guardian | Newspaper Subscription"
    val id = EmptyDiv("paper-subscription-checkout-page")
    val js = "paperSubscriptionCheckoutPage.js"
    val css = "paperSubscriptionCheckoutPage.css"
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
      priceSummaryServiceProvider.forUser(uatMode).getPrices(Paper, promoCodes),
      stripeConfigProvider.get(false),
      stripeConfigProvider.get(true),
      payPalConfigProvider.get(false),
      payPalConfigProvider.get(true),
      stripeSetupIntentEndpoint
    )
  }


}
