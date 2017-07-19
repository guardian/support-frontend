package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import cats.data.OptionT
import play.api.mvc._
import play.api.libs.circe.Circe

import scala.concurrent.ExecutionContext
import cats.implicits._
import com.gu.identity.play.IdUser
import services.{IdentityService, TestUserService}
import com.typesafe.scalalogging.LazyLogging
import views.html.oneOffContributions
import config.TouchpointConfigProvider

import scala.concurrent.Future

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

  def displayForm: Action[AnyContent] = MaybeAuthenticated.async { implicit request =>
    request.user
      .map(identityService.getUser(_))
      .fold(OptionT.none[Future, IdUser])(_.toOption)
      .value.map { optUser =>

        val isTestUser = optUser.exists { user =>
          testUsers.isTestUser(user.publicFields.displayName)
        }

        Ok(
          oneOffContributions(
            title = "Support the Guardian | One-off Contribution",
            id = "oneoff-contributions-page",
            js = "oneoffContributionsPage.js",
            optUser = optUser,
            isTestUser = isTestUser,
            stripeConfig = touchpointConfigProvider.getStripeConfig(isTestUser)
          )
        )
      }
  }
}
