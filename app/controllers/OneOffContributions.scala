package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import play.api.mvc._
import play.api.libs.circe.Circe

import scala.concurrent.ExecutionContext
import services.{IdentityService, TestUserService}
import com.typesafe.scalalogging.LazyLogging
import views.html.oneOffContributions
import config.TouchpointConfigProvider
import cats.implicits._
import com.gu.identity.play.IdUser
import models.Autofill
import io.circe.syntax._

class OneOffContributions(
    val assets: AssetsResolver,
    actionRefiners: CustomActionBuilders,
    identityService: IdentityService,
    testUsers: TestUserService,
    touchpointConfigProvider: TouchpointConfigProvider,
    components: ControllerComponents
)(implicit val exec: ExecutionContext) extends AbstractController(components) with Circe with LazyLogging {

  import actionRefiners._

  implicit val ar = assets

  def displayForm: Action[AnyContent] = CachedAction.varyByHeader("X-GU-Test-User") { header =>
    val isTestUser = header.contains("true")
    Ok(
      oneOffContributions(
        title = "Support the Guardian | One-off Contribution",
        id = "oneoff-contributions-page",
        js = "oneoffContributionsPage.js",
        isTestUser = isTestUser,
        stripeConfig = touchpointConfigProvider.getStripeConfig(isTestUser)
      )
    )
  }

  def autofill: Action[AnyContent] = AuthenticatedAction.async { implicit request =>
    identityService.getUser(request.user).fold(
      _ => Ok(Autofill.empty.asJson),
      user => Ok(Autofill(fullNameFor(user), Some(user.primaryEmailAddress)).asJson)
    )
  }

  private def fullNameFor(user: IdUser) = {
    for {
      privateFields <- user.privateFields
      firstName <- privateFields.firstName
      lastName <- privateFields.firstName
    } yield s"$firstName $lastName"
  }
}
