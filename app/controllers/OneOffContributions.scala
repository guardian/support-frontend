package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import play.api.mvc._
import play.api.libs.circe.Circe

import scala.concurrent.{ExecutionContext, Future}

import services.{IdentityService, PaymentAPIService, TestUserService}
import views.html.oneOffContributions
import com.gu.support.config.StripeConfigProvider
import cats.implicits._
import com.gu.googleauth.AuthAction
import com.gu.identity.play.IdUser
import models.Autofill
import io.circe.syntax._
import play.twirl.api.Html
import admin.{Settings, SettingsProvider, SettingsSurrogateKeySyntax}

class OneOffContributions(
    val assets: AssetsResolver,
    actionRefiners: CustomActionBuilders,
    identityService: IdentityService,
    testUsers: TestUserService,
    stripeConfigProvider: StripeConfigProvider,
    paymentAPIService: PaymentAPIService,
    authAction: AuthAction[AnyContent],
    components: ControllerComponents,
    settingsProvider: SettingsProvider
)(implicit val exec: ExecutionContext) extends AbstractController(components) with Circe with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def autofill: Action[AnyContent] = authenticatedAction().async { implicit request =>
    identityService.getUser(request.user).fold(
      _ => Ok(Autofill.empty.asJson),
      user => Ok(Autofill(id = Some(user.id), name = fullNameFor(user), email = Some(user.primaryEmailAddress)).asJson)
    )
  }

  private def formHtml(idUser: Option[IdUser])(implicit request: RequestHeader, settings: Settings) = {
    oneOffContributions(
      title = "Support the Guardian | Single Contribution",
      id = "oneoff-contributions-page",
      js = "oneoffContributionsPage.js",
      css = "oneoffContributionsPageStyles.css",
      defaultStripeConfig = stripeConfigProvider.get(false),
      uatStripeConfig = stripeConfigProvider.get(true),
      paymentApiStripeEndpoint = paymentAPIService.stripeExecutePaymentEndpoint,
      paymentApiPayPalEndpoint = paymentAPIService.payPalCreatePaymentEndpoint,
      idUser = idUser
    )
  }

  def displayForm(): Action[AnyContent] = maybeAuthenticatedAction().async { implicit request =>
    implicit val settings: Settings = settingsProvider.settings()
    request.user
      .fold(Future.successful(Ok(formHtml(None)))) { minimalUser =>
        identityService.getUser(minimalUser).fold(
          _ => Ok(formHtml(None)),
          user => Ok(formHtml(Some(user)))
        )
      }
      .map(_.withSettingsSurrogateKey)
  }

  private def fullNameFor(user: IdUser): Option[String] = {
    for {
      privateFields <- user.privateFields
      firstName <- privateFields.firstName
      secondName <- privateFields.secondName
    } yield s"$firstName $secondName"
  }
}
