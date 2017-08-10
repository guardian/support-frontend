package controllers

import actions.{CacheControl, CustomActionBuilders}
import assets.AssetsResolver
import play.api.mvc._
import play.api.libs.circe.Circe

import scala.concurrent.ExecutionContext
import services.{IdentityService, TestUserService}
import com.typesafe.scalalogging.LazyLogging
import views.html.oneOffContributions
import com.gu.support.config.StripeConfigProvider
import cats.implicits._
import com.gu.googleauth.AuthAction
import com.gu.identity.play.IdUser
import models.Autofill
import io.circe.syntax._

class OneOffContributions(
    val assets: AssetsResolver,
    actionRefiners: CustomActionBuilders,
    identityService: IdentityService,
    testUsers: TestUserService,
    stripeConfigProvider: StripeConfigProvider,
    contributionsEndpoint: String,
    authAction: AuthAction[AnyContent],
    components: ControllerComponents
)(implicit val exec: ExecutionContext) extends AbstractController(components) with Circe with LazyLogging {

  import actionRefiners._

  implicit val ar = assets

  def displayForm(country: String): Action[AnyContent] = CachedAction() {
    form(uatMode = false, country)
  }

  def displayFormTestUser(country: String): Action[AnyContent] = authAction {
    form(uatMode = true, country).withHeaders(CacheControl.noCache)
  }

  def autofill: Action[AnyContent] = AuthenticatedAction.async { implicit request =>
    identityService.getUser(request.user).fold(
      _ => Ok(Autofill.empty.asJson),
      user => Ok(Autofill(fullNameFor(user), Some(user.primaryEmailAddress)).asJson)
    )
  }

  private def form(uatMode: Boolean, country: String = "uk"): Result = Ok(
    oneOffContributions(
      title = "Support the Guardian | One-off Contribution",
      id = "oneoff-contributions-page",
      js = "oneoffContributionsPage.js",
      uatMode = uatMode,
      stripeConfig = stripeConfigProvider.get(uatMode),
      contributionsEnpoint = contributionsEndpoint,
      country = country
    )
  )

  private def fullNameFor(user: IdUser): Option[String] = {
    for {
      privateFields <- user.privateFields
      firstName <- privateFields.firstName
      lastName <- privateFields.firstName
    } yield s"$firstName $lastName"
  }
}
