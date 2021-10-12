package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver}
import cats.data.EitherT
import cats.implicits._
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.pricing.PriceSummaryServiceProvider
import com.gu.support.promotions.DefaultPromotions
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import config.RecaptchaConfigProvider
import play.api.mvc._
import play.twirl.api.Html
import services.{IdentityService, TestUserService}
import views.EmptyDiv
import views.html.helper.CSRF
import views.html.subscriptionCheckout

import scala.concurrent.{ExecutionContext, Future}

class WeeklySubscriptionFormController(
  priceSummaryServiceProvider: PriceSummaryServiceProvider,
  val assets: AssetsResolver,
  val actionRefiners: CustomActionBuilders,
  identityService: IdentityService,
  testUsers: TestUserService,
  stripeConfigProvider: StripeConfigProvider,
  payPalConfigProvider: PayPalConfigProvider,
  components: ControllerComponents,
  settingsProvider: AllSettingsProvider,
  recaptchaConfigProvider: RecaptchaConfigProvider
)(implicit val ec: ExecutionContext) extends AbstractController(components) with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def displayForm(orderIsAGift: Boolean): Action[AnyContent] = maybeAuthenticatedAction().async { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val maybeIdUser: EitherT[Future, String, Option[IdUser]] = request.user match {
      case Some(user) =>
        identityService.getUser(user.minimalUser).map(Some(_))
      case None => EitherT.rightT(None)
    }
    maybeIdUser.fold(
      error => {
        val maybeIdentityId = request.user.map(_.minimalUser.id).getOrElse("unknown identity id")
        SafeLogger.error(scrub"Failed to display Guardian Weekly subscriptions form for ${maybeIdentityId} due to error from identityService: $error")
        InternalServerError
      },
      user => Ok(weeklySubscriptionFormHtml(user, orderIsAGift))
    ).map(_.withSettingsSurrogateKey)

  }

  private def weeklySubscriptionFormHtml(maybeIdUser: Option[IdUser], orderIsAGift: Boolean)(implicit request: RequestHeader, settings: AllSettings): Html = {
    val title = "Support the Guardian | Guardian Weekly Subscription"
    val id = EmptyDiv("weekly-subscription-checkout-page")
    val js = "weeklySubscriptionCheckoutPage.js"
    val css = "weeklySubscriptionCheckoutPage.css"
    val csrf = CSRF.getToken.value

    val maybeUatUsername =  maybeIdUser.flatMap(_.publicFields.displayName)
      .orElse(request.cookies.get("_test_username").map(_.value))
    val uatMode = testUsers.isTestUser(maybeUatUsername)
    val defaultPromos = if (orderIsAGift)
      DefaultPromotions.GuardianWeekly.Gift.all
    else
      DefaultPromotions.GuardianWeekly.NonGift.all
    val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil) ++ defaultPromos
    val readerType = if (orderIsAGift) Gift else Direct
    val v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(isTestUser = uatMode).v2PublicKey

    subscriptionCheckout(
      title,
      id,
      js,
      css,
      Some(csrf),
      maybeIdUser,
      uatMode,
      priceSummaryServiceProvider.forUser(uatMode).getPrices(GuardianWeekly, promoCodes, readerType),
      stripeConfigProvider.get(),
      stripeConfigProvider.get(true),
      payPalConfigProvider.get(),
      payPalConfigProvider.get(true),
      v2recaptchaConfigPublicKey,
      orderIsAGift
    )
  }


}
