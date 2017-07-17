package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import services.stepfunctions.{CreateMonthlyContributorRequest, MonthlyContributionsClient}
import play.api.mvc._
import play.api.libs.circe.Circe

import scala.concurrent.ExecutionContext
import cats.implicits._
import com.gu.identity.play.{AccessCredentials, IdUser}
import lib.PlayImplicits._
import services.{IdentityService, MembersDataService, TestUserService}
import services.MembersDataService.UserNotFound
import com.gu.support.workers.model.User
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.Future
import views.html.monthlyContributions
import config.StripeConfigProvider

class MonthlyContributions(
    client: MonthlyContributionsClient,
    val assets: AssetsResolver,
    actionRefiners: CustomActionBuilders,
    membersDataService: MembersDataService,
    identityService: IdentityService,
    testUsers: TestUserService,
    stripeConfigProvider: StripeConfigProvider,
    components: ControllerComponents
)(implicit val exec: ExecutionContext) extends AbstractController(components) with Circe with LazyLogging {

  import actionRefiners._

  implicit val ar = assets

  def displayForm: Action[AnyContent] = AuthenticatedTestUserAction.async { implicit request =>
    identityService.getUser(request.user).semiflatMap { fullUser =>
      isMonthlyContributor(request.user.credentials) map {
        case Some(true) => Redirect("/monthly-contributions/existing-contributor")
        case Some(false) | None =>
          val isTestUser = testUsers.isTestUser(fullUser.publicFields.displayName)
          Ok(
            monthlyContributions(
              title = "Support the Guardian | Monthly Contributions",
              id = "monthly-contributions-page",
              js = "monthlyContributionsPage.js",
              user = fullUser,
              isTestUser = isTestUser,
              stripeConfig = stripeConfigProvider.get(isTestUser)
            )
          )
      }
    } getOrElse InternalServerError
  }

  def create: Action[CreateMonthlyContributorRequest] = AuthenticatedAction.async(circe.json[CreateMonthlyContributorRequest]) { implicit request =>
    logger.info(s"[${request.uuid}] User ${request.user.id} is attempting to create a new monthly contribution")

    val result = for {
      user <- identityService.getUser(request.user)
      response <- client.createContributor(request.body, contributor(user, request.body), request.uuid).leftMap(_.toString)
    } yield response

    result.fold(
      { error =>
        logger.error(s"Failed to create new monthly contributor: $error")
        InternalServerError
      },
      _ => Accepted
    )
  }

  private def contributor(user: IdUser, request: CreateMonthlyContributorRequest) = {
    User(
      id = user.id,
      primaryEmailAddress = user.primaryEmailAddress,
      firstName = request.firstName,
      lastName = request.lastName,
      country = request.country,
      allowMembershipMail = true,
      allowThirdPartyMail = user.statusFields.flatMap(_.receive3rdPartyMarketing).getOrElse(false),
      allowGURelatedMail = user.statusFields.flatMap(_.receiveGnmMarketing).getOrElse(false),
      isTestUser = testUsers.isTestUser(user.publicFields.displayName)
    )
  }

  private def isMonthlyContributor(credentials: AccessCredentials) = credentials match {
    case cookies: AccessCredentials.Cookies =>
      membersDataService.userAttributes(cookies).fold(
        {
          case UserNotFound => Some(false)
          case error =>
            logger.error(s"Failed to fetch user attributes from members data service: $error")
            None
        },
        { response => Some(response.contentAccess.recurringContributor) }
      )
    case _ => Future.successful(None)
  }
}
