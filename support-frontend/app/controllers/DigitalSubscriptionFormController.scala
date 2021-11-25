package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.data.EitherT
import cats.implicits._
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.catalog.DigitalPack
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.pricing.PriceSummaryServiceProvider
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import config.RecaptchaConfigProvider
import controllers.UserDigitalSubscription.{redirectToExistingThankYouPage, userHasDigitalSubscription}
import play.api.mvc._
import play.twirl.api.Html
import services._
import views.EmptyDiv
import views.html.helper.CSRF
import views.html.subscriptionCheckout

import scala.concurrent.{ExecutionContext, Future}

class DigitalSubscriptionFormController(
  priceSummaryServiceProvider: PriceSummaryServiceProvider,
  val assets: AssetsResolver,
  val actionRefiners: CustomActionBuilders,
  identityService: IdentityService,
  testUsers: TestUserService,
  membersDataService: MembersDataService,
  stripeConfigProvider: StripeConfigProvider,
  payPalConfigProvider: PayPalConfigProvider,
  components: ControllerComponents,
  settingsProvider: AllSettingsProvider,
  recaptchaConfigProvider: RecaptchaConfigProvider
)(implicit val ec: ExecutionContext) extends AbstractController(components) with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def displayForm(orderIsAGift: Boolean): Action[AnyContent] = {
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    maybeAuthenticatedAction().async { implicit request =>
      val maybeIdUser: EitherT[Future, String, Option[IdUser]] = request.user match {
        case Some(user) =>
          identityService.getUser(user.minimalUser).map(Some(_))
        case _ => EitherT.rightT(None)
      }
      maybeIdUser.fold(
        error => {
          val maybeIdentityId = request.user.map(_.minimalUser.id).getOrElse("unknown identity id")
          SafeLogger.error(scrub"Failed to display digital subscriptions form for ${maybeIdentityId} due to error from identityService: $error")
          InternalServerError
        },
        user =>
          if (orderIsAGift)
            Ok(digitalSubscriptionFormHtml(user, orderIsAGift = true))
          else
            Ok(digitalSubscriptionFormHtml(user, orderIsAGift = false))
      ).map(_.withSettingsSurrogateKey)
    }
  }

  private def digitalSubscriptionFormHtml(maybeIdUser: Option[IdUser], orderIsAGift: Boolean)(implicit request: RequestHeader, settings: AllSettings): Html = {
    val title = if (orderIsAGift) {
      "Support the Guardian | The Guardian Digital Gift Subscription"
    } else {
      "Support the Guardian | The Guardian Digital Subscription"
    }
    val id = EmptyDiv("digital-subscription-checkout-page")
    val js = "digitalSubscriptionCheckoutPage.js"
    val css = "digitalSubscriptionCheckoutPage.css"
    val csrf = CSRF.getToken.value

    val uatMode = testUsers.isTestUser(request)
    val promoCodes = request.queryString.get("promoCode").map(_.toList).getOrElse(Nil)
    val v2recaptchaConfigPublicKey = recaptchaConfigProvider.get(uatMode).v2PublicKey
    val readerType = if (orderIsAGift) Gift else Direct

    subscriptionCheckout(
      title,
      id,
      js,
      css,
      Some(csrf),
      maybeIdUser,
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
      css
    )()
    )
  }

}
