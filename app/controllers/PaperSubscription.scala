package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.AssetsResolver
import com.gu.identity.play.IdUser
import com.gu.support.catalog.Paper
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.pricing.PriceSummaryServiceProvider
import com.gu.tip.Tip
import config.Configuration.GuardianDomain
import config.StringsConfig
import play.api.mvc._
import play.twirl.api.Html
import services.stepfunctions.SupportWorkersClient
import services.{IdentityService, MembersDataService, TestUserService}
import views.html.digitalSubscription
import views.html.helper.CSRF
import monitoring.SafeLogger
import monitoring.SafeLogger._
import cats.data.EitherT
import cats.implicits._
import play.api.libs.circe.Circe

import scala.concurrent.{ExecutionContext, Future}

class PaperSubscription(
  priceSummaryServiceProvider: PriceSummaryServiceProvider,
  client: SupportWorkersClient,
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
  tipMonitoring: Tip,
  guardianDomain: GuardianDomain
)(implicit val ec: ExecutionContext) extends AbstractController(components) with GeoRedirect with Circe with CanonicalLinks with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets


  def paperMethodRedirect(withDelivery: Boolean = false): Action[AnyContent] = Action { implicit request =>
    Redirect(buildCanonicalPaperSubscriptionLink(withDelivery), request.queryString, status = FOUND)
  }

  def paper(withDelivery: Boolean = false): Action[AnyContent] = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "The Guardian Newspaper Subscription | Vouchers and Delivery"
    val id = if (withDelivery) "paper-subscription-landing-page-delivery" else "paper-subscription-landing-page-collection"
    val js = "paperSubscriptionLandingPage.js"
    val css = "paperSubscriptionLandingPage.css"
    val canonicalLink = Some(buildCanonicalPaperSubscriptionLink())
    val description = stringsConfig.paperLandingDescription

    Ok(views.html.main(title, id, js, css, description, canonicalLink)).withSettingsSurrogateKey
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
          Future.successful(Ok(paperSubscriptionFormHtml(user)))
        }
      ).flatten.map(_.withSettingsSurrogateKey)
    }

  private def paperSubscriptionFormHtml(idUser: IdUser)(implicit request: RequestHeader, settings: AllSettings): Html = {
    val title = "Support the Guardian | Newspaper Subscription"
    val id = "paper-subscription-checkout-page"
    val js = "paperSubscriptionCheckoutPage.js"
    val css = "paperSubscriptionCheckoutPage.css"
    val csrf = CSRF.getToken.value
    val uatMode = testUsers.isTestUser(idUser.publicFields.displayName)
    val promoCode = request.queryString.get("promoCode").flatMap(_.headOption)

    digitalSubscription(
      title,
      id,
      js,
      css,
      Some(csrf),
      idUser,
      uatMode,
      priceSummaryServiceProvider.forUser(uatMode).getPrices(Paper, promoCode),
      stripeConfigProvider.get(false),
      stripeConfigProvider.get(true),
      payPalConfigProvider.get(uatMode)
    )
  }


}
